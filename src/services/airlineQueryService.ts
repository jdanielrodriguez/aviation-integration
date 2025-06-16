import { AppDataSource } from '../config/database';
import { Airline } from '../models/airline';
import { AirlineQueryParams } from '../types/airline';

/**
* Gets a list of airlines from the database with pagination and searching.
* @param query - Query parameters for filtering and paginating the results.
* @returns An object containing the pagination and airline data.
*/
export async function getAirlinesFromDb(query: AirlineQueryParams) {
   const {
      search = '',
      limit = '20',
      offset = '0'
   } = query;

   const repo = AppDataSource.getRepository(Airline);

   const qb = repo.createQueryBuilder('airline');

   if (search) {
      const like = `%${search.toLowerCase()}%`;
      qb.where('LOWER(airline.airline_name) LIKE :like', { like })
         .orWhere('LOWER(airline.iata_code) LIKE :like', { like })
         .orWhere('LOWER(airline.icao_code) LIKE :like', { like });
   }

   qb.orderBy('airline.id', 'DESC');
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
