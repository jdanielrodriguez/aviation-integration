import axios from 'axios';
import logger from '../config/logger';
import { redisClient } from '../app';
import { sendAdminEmail } from '../utils/emailSender';
import { AppDataSource } from '../config/database';
import { ApiCall } from '../models/apiCall';
import { config } from '../config/api';
import { AirportQueryParams } from '../types/airport';
import { FlightQueryParams } from '../types/flight';

async function getFromCache(key: string): Promise<any | null> {
   const cached = await redisClient.get(key);
   return cached ? JSON.parse(cached) : null;
}

async function setCache(key: string, data: any, ttl: number = 90) {
   await redisClient.setEx(key, ttl, JSON.stringify(data));
}

async function logApiCall(endpoint: string, params: FlightQueryParams | AirportQueryParams, response: any, statusCode: number) {
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

async function fetch(endpoint: string, params: FlightQueryParams | AirportQueryParams) {
   const queryStr = new URLSearchParams({ access_key: config.AVIATIONSTACK_KEY, ...params }).toString();
   const url = `${config.AVIATIONSTACK_URL}/${endpoint}?${queryStr}`;
   const cacheKey = `${endpoint}:${queryStr}`;

   const cached = await getFromCache(cacheKey);
   if (cached) {
      logger.debug(`[CACHE] HIT ${cacheKey}`);
      return cached;
   }

   try {
      logger.debug(`[API] Requesting ${url}`);
      const { data, status } = await axios.get(url);
      await logApiCall(endpoint, params, data, status);
      await setCache(cacheKey, data);
      return data;
   } catch (err: any) {
      logger.error(`[API] ERROR calling ${url}: ${err.message}`);
      await sendAdminEmail(`Error crítico al consultar ${endpoint}`, err.stack || err.message);
      throw new Error('Error al consultar el servicio externo');
   }
}

export const getFlights = (params: FlightQueryParams) => fetch('flights', params);
export const getAirports = (params: AirportQueryParams) => fetch('airports', params);

