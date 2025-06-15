import axios from 'axios';
import { MoreThanOrEqual } from 'typeorm';
import { redisClient } from '../app';
import logger from '../config/logger';
import { config, isTestEnv } from '../config/api';
import { AppDataSource } from '../config/database';
import { AirportQueryParams } from '../types/airport';
import { FlightQueryParams } from '../types/flight';
import { sendAdminEmail } from '../utils/emailSender';
import { ApiCall } from '../models/apiCall';
import { Airport } from '../models/airport';
import { Flight } from '../models/flight';
import { MOCK_FLIGHTS } from '../test/mocks/aviationData';

export async function hasSyncedToday(endpoint: string): Promise<boolean> {
   const repo = AppDataSource.getRepository(ApiCall);
   const todayStart = new Date();
   todayStart.setUTCHours(0, 0, 0, 0);

   const result = await repo.findOne({
      where: {
         endpoint,
         timestamp: MoreThanOrEqual(todayStart),
         status_code: 200
      }
   });

   return !!result;
}

export async function getFromCache(key: string): Promise<any | null> {
   const cached = await redisClient.get(key);
   return cached ? JSON.parse(cached) : null;
}

export async function setCache(key: string, data: any, ttl: number = 90) {
   await redisClient.setEx(key, ttl, JSON.stringify(data));
}

export async function fetch(endpoint: string, params: FlightQueryParams | AirportQueryParams) {
   const queryStr = new URLSearchParams(
      Object.fromEntries(
         Object.entries({ access_key: config.AVIATIONSTACK_KEY, ...params }).filter(
            ([, v]) => v !== undefined
         )
      ) as Record<string, string>
   ).toString();
   const url = `${config.AVIATIONSTACK_URL}/${endpoint}?${queryStr}`;
   const cacheKey = `${endpoint}:${queryStr}`;

   const cached = await getFromCache(cacheKey);
   if (cached) {
      logger.debug(`[CACHE] HIT ${cacheKey}`);
      return cached;
   }

   if (isTestEnv) {
      logger.debug(`[TEST] Returning mocked data for ${endpoint}`);
      return {
         data: MOCK_FLIGHTS,
         pagination: { count: 1, total: 1, limit: 100, offset: 0 }
      };
   }

   try {
      logger.debug(`[API] Requesting ${url}`);
      const { data, status } = await axios.get(url);
      await logApiCall(endpoint, params, data, status);
      await setCache(cacheKey, data);
      return data;
   } catch (err: any) {
      logger.error(`[API] ERROR calling ${url}: ${err.message}`);

      await sendAdminEmail(
         `❌ AviationStack failure: ${endpoint}`,
         `Failed to fetch from external API.\n\nError: ${err.stack || err.message}`
      );

      throw new Error('External API unavailable');
   }
}

export async function syncAirportsIfNeeded() {
   if (isTestEnv) return;
   const alreadySynced = await hasSyncedToday('airports');
   if (alreadySynced) return;

   const { data } = await getAirports({});

   const repo = AppDataSource.getRepository(Airport);

   for (const item of data) {
      await repo.upsert({
         airport_name: item.airport_name,
         iata_code: item.iata_code,
         icao_code: item.icao_code,
         latitude: parseFloat(item.latitude),
         longitude: parseFloat(item.longitude),
         timezone: item.timezone,
         gmt: item.gmt,
         country_name: item.country_name,
         country_iso2: item.country_iso2,
         city_iata_code: item.city_iata_code
      }, ['iata_code']);
   }
}

export async function syncFlightsIfNeeded() {
   if (isTestEnv) return;
   const alreadySynced = await hasSyncedToday('flights');
   if (alreadySynced) return;

   const { data } = await getFlights({});

   const repo = AppDataSource.getRepository(Flight);

   for (const item of data) {
      const existing = await repo
         .createQueryBuilder('flight')
         .where('flight.flight_date = :date', { date: item.flight_date })
         .andWhere('JSON_UNQUOTE(JSON_EXTRACT(`flight`.`flight`, "$.iata")) = :iata', {
            iata: item.flight?.iata
         })
         .getOne();


      if (existing) {
         await repo.save({
            ...existing, ...item,
            dep_iata: item.departure?.iata,
            arr_iata: item.arrival?.iata,
            flight_number: item.flight?.number
         });
      } else {
         await repo.save({
            ...item,
            dep_iata: item.departure?.iata,
            arr_iata: item.arrival?.iata,
            flight_number: item.flight?.number
         });
      }
   }
}

export async function logApiCall(
   endpoint: string,
   params: FlightQueryParams | AirportQueryParams,
   response: any,
   statusCode: number
) {
   const repo = AppDataSource.getRepository(ApiCall);
   const call = repo.create({
      endpoint,
      parameters: params,
      response,
      status_code: statusCode,
      timestamp: new Date()
   });
   await repo.save(call);
}

export const getFlights = (params: FlightQueryParams) => fetch('flights', params);
export const getAirports = (params: AirportQueryParams) => fetch('airports', params);

