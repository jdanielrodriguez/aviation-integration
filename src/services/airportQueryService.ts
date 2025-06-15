import { AppDataSource } from '../config/database';
import { Airport } from '../models/airport';
import { AirportQueryParams } from '../types/airport';

/**
 * Obtiene una lista de aeropuertos desde la base de datos con paginación y búsqueda.
 * @param query - Parámetros de consulta para filtrar y paginar los resultados.
 * @returns Un objeto que contiene la paginación y los datos de los aeropuertos.
 */
export async function getAirportsFromDb(query: AirportQueryParams) {
   const {
      search = '',
      limit = '20',
      offset = '0'
   } = query;

   const repo = AppDataSource.getRepository(Airport);

   const qb = repo.createQueryBuilder('airport');

   if (search) {
      const like = `%${search.toLowerCase()}%`;
      qb.where('LOWER(airport.airport_name) LIKE :like', { like })
         .orWhere('LOWER(airport.iata_code) LIKE :like', { like })
         .orWhere('LOWER(airport.city_iata_code) LIKE :like', { like })
         .orWhere('LOWER(airport.country_name) LIKE :like', { like });
   }

   qb.orderBy('airport.id', 'DESC');
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
