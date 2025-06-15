import { AppDataSource } from '../../config/database';
import { getAirportsFromDb } from '../../services/airportQueryService';
import { Airport } from '../../models/airport';

beforeAll(async () => {
   if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      await AppDataSource.runMigrations();
   }

   const repo = AppDataSource.getRepository(Airport);

   await repo.clear();

   await repo.save([
      {
         airport_name: 'La Aurora International',
         iata_code: 'GUA',
         icao_code: 'MGGT',
         latitude: 14.5833,
         longitude: -90.5275,
         timezone: 'America/Guatemala',
         gmt: '-6',
         country_name: 'Guatemala',
         country_iso2: 'GT',
         city_iata_code: 'GUA'
      },
      {
         airport_name: 'Quetzaltenango',
         iata_code: 'AAZ',
         icao_code: 'MGQZ',
         latitude: 14.8656,
         longitude: -91.5017,
         timezone: 'America/Guatemala',
         gmt: '-6',
         country_name: 'Guatemala',
         country_iso2: 'GT',
         city_iata_code: 'AAZ'
      }
   ]);
});

afterAll(async () => {
   await AppDataSource.destroy();
});

describe('getAirportsFromDb() - cobertura mínima asegurada', () => {
   it('filtra por nombre de aeropuerto', async () => {
      const result = await getAirportsFromDb({ search: 'aurora' });
      expect(result.data.some(a => a.iata_code === 'GUA')).toBe(true);
   });

   it('filtra por iata_code', async () => {
      const result = await getAirportsFromDb({ search: 'AAZ' });
      expect(result.data.some(a => a.iata_code === 'AAZ')).toBe(true);
   });

   it('filtra por city_iata_code', async () => {
      const result = await getAirportsFromDb({ search: 'aaz' });
      expect(result.data.some(a => a.city_iata_code === 'AAZ')).toBe(true);
   });

   it('filtra por country_name', async () => {
      const result = await getAirportsFromDb({ search: 'guatemala' });
      expect(result.data.some(a => a.country_name === 'Guatemala')).toBe(true);
   });

   it('aplica paginación', async () => {
      const result = await getAirportsFromDb({ limit: '1', offset: '0' });
      expect(result.data.length).toBeLessThanOrEqual(1);
      expect(result.pagination.limit).toBe(1);
   });
});
