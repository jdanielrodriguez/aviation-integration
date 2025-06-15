import { AppDataSource } from '../config/database';
import { Flight } from '../models/flight';
import { FlightQueryParams } from '../types/flight';

/**
 * Obtiene una lista de vuelos desde la base de datos con paginación y búsqueda.
 * @param query - Parámetros de consulta para filtrar y paginar los resultados.
 * @returns Un objeto que contiene la paginación y los datos de los vuelos.
 */
export async function getFlightsFromDb(query: FlightQueryParams) {
   const repo = AppDataSource.getRepository(Flight);

   const {
      flight_date,
      flight_status,
      dep_iata,
      arr_iata,
      dep_icao,
      arr_icao,
      airline_name,
      airline_iata,
      airline_icao,
      flight_number,
      flight_iata,
      flight_icao,
      min_delay_dep,
      min_delay_arr,
      max_delay_dep,
      max_delay_arr,
      arr_scheduled_time_arr,
      arr_scheduled_time_dep,
      limit = '20',
      offset = '0'
   } = query;

   const qb = repo.createQueryBuilder('flight');

   if (flight_date) {
      qb.andWhere('flight.flight_date = :flight_date', { flight_date });
   }

   if (flight_status) {
      qb.andWhere('LOWER(flight.flight_status) = :flight_status', {
         flight_status: flight_status.toLowerCase()
      });
   }

   if (flight_number) {
      qb.andWhere('LOWER(flight.flight_number) = :flight_number', {
         flight_number: flight_number.toLowerCase()
      });
   }

   if (flight_iata) {
      qb.andWhere('LOWER(JSON_UNQUOTE(JSON_EXTRACT(flight.flight, "$.iata"))) = :flight_iata', {
         flight_iata: flight_iata.toLowerCase()
      });
   }

   if (flight_icao) {
      qb.andWhere('LOWER(JSON_UNQUOTE(JSON_EXTRACT(flight.flight, "$.icao"))) = :flight_icao', {
         flight_icao: flight_icao.toLowerCase()
      });
   }

   if (dep_iata) {
      qb.andWhere('LOWER(flight.dep_iata) = :dep_iata', {
         dep_iata: dep_iata.toLowerCase()
      });
   }

   if (arr_iata) {
      qb.andWhere('LOWER(flight.arr_iata) = :arr_iata', {
         arr_iata: arr_iata.toLowerCase()
      });
   }

   if (dep_icao) {
      qb.andWhere('LOWER(JSON_UNQUOTE(JSON_EXTRACT(flight.departure, "$.icao"))) = :dep_icao', {
         dep_icao: dep_icao.toLowerCase()
      });
   }

   if (arr_icao) {
      qb.andWhere('LOWER(JSON_UNQUOTE(JSON_EXTRACT(flight.arrival, "$.icao"))) = :arr_icao', {
         arr_icao: arr_icao.toLowerCase()
      });
   }

   if (airline_name) {
      qb.andWhere('LOWER(JSON_UNQUOTE(JSON_EXTRACT(flight.airline, "$.name"))) = :airline_name', {
         airline_name: airline_name.toLowerCase()
      });
   }

   if (airline_iata) {
      qb.andWhere('LOWER(JSON_UNQUOTE(JSON_EXTRACT(flight.airline, "$.iata"))) = :airline_iata', {
         airline_iata: airline_iata.toLowerCase()
      });
   }

   if (airline_icao) {
      qb.andWhere('LOWER(JSON_UNQUOTE(JSON_EXTRACT(flight.airline, "$.icao"))) = :airline_icao', {
         airline_icao: airline_icao.toLowerCase()
      });
   }

   if (min_delay_dep) {
      qb.andWhere('CAST(JSON_EXTRACT(flight.departure, "$.delay") AS UNSIGNED) >= :min_delay_dep', {
         min_delay_dep: Number(min_delay_dep)
      });
   }

   if (min_delay_arr) {
      qb.andWhere('CAST(JSON_EXTRACT(flight.arrival, "$.delay") AS UNSIGNED) >= :min_delay_arr', {
         min_delay_arr: Number(min_delay_arr)
      });
   }

   if (max_delay_dep) {
      qb.andWhere('CAST(JSON_EXTRACT(flight.departure, "$.delay") AS UNSIGNED) <= :max_delay_dep', {
         max_delay_dep: Number(max_delay_dep)
      });
   }

   if (max_delay_arr) {
      qb.andWhere('CAST(JSON_EXTRACT(flight.arrival, "$.delay") AS UNSIGNED) <= :max_delay_arr', {
         max_delay_arr: Number(max_delay_arr)
      });
   }

   if (arr_scheduled_time_arr) {
      qb.andWhere('DATE(JSON_UNQUOTE(JSON_EXTRACT(flight.arrival, "$.scheduled"))) = :arr_scheduled_time_arr', {
         arr_scheduled_time_arr
      });
   }

   if (arr_scheduled_time_dep) {
      qb.andWhere('DATE(JSON_UNQUOTE(JSON_EXTRACT(flight.departure, "$.scheduled"))) = :arr_scheduled_time_dep', {
         arr_scheduled_time_dep
      });
   }

   qb.skip(Number(offset)).take(Number(limit));

   const [data, total] = await qb.getManyAndCount();

   return {
      pagination: {
         total,
         offset: Number(offset),
         limit: Number(limit),
         count: data.length
      },
      data
   };
}
