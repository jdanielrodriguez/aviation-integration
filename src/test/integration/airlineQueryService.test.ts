import { AppDataSource } from '../../../src/config/database';
import { getAirlinesFromDb } from '../../../src/services/airlineQueryService';
import { Airline } from '../../../src/models/airline';

beforeAll(async () => {
   if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      await AppDataSource.runMigrations();
   }
   const repo = AppDataSource.getRepository(Airline);
   await repo.clear();
   await repo.save([
      {
         airline_name: 'Unit Airline',
         iata_code: 'UA',
         icao_code: 'UNT',
         callsign: 'UNIT',
         country_name: 'Unittest'
      },
      {
         airline_name: 'Other Airline',
         iata_code: 'OA',
         icao_code: 'OTH',
         callsign: 'OTHER',
         country_name: 'Unittest'
      }
   ]);
});

afterAll(async () => {
   await AppDataSource.destroy();
});

describe('getAirlinesFromDb() minimal coverage', () => {
   it('filters by airline_name', async () => {
      const result = await getAirlinesFromDb({ search: 'Unit' });
      expect(result.data.some(a => a.airline_name === 'Unit Airline')).toBe(true);
   });

   it('filters by iata_code', async () => {
      const result = await getAirlinesFromDb({ search: 'UA' });
      expect(result.data.some(a => a.iata_code === 'UA')).toBe(true);
   });

   it('filters by icao_code', async () => {
      const result = await getAirlinesFromDb({ search: 'OTH' });
      expect(result.data.some(a => a.icao_code === 'OTH')).toBe(true);
   });

   it('applies pagination', async () => {
      const result = await getAirlinesFromDb({ limit: '1', offset: '0' });
      expect(result.data.length).toBeLessThanOrEqual(1);
      expect(result.pagination.limit).toBe(1);
   });
});
