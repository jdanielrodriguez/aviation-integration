import request from 'supertest';
import app from '../../../src/app';
import { AppDataSource } from '../../../src/config/database';
import { Airline } from '../../../src/models/airline';

beforeAll(async () => {
   if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      await AppDataSource.runMigrations();
   }
   const repo = AppDataSource.getRepository(Airline);
   await repo.clear();
   await repo.save({
      airline_name: 'Test Airline',
      iata_code: 'TA',
      icao_code: 'TST',
      callsign: 'TEST',
      type: 'scheduled',
      status: 'active',
      fleet_size: '5',
      fleet_average_age: '7',
      date_founded: '2000',
      hub_code: 'TST',
      iata_prefix_accounting: '888',
      country_name: 'Testland',
      country_iso2: 'TL'
   });
});

afterAll(async () => {
   await AppDataSource.destroy();
});

describe('GET /api/v1/airlines', () => {
   it('should return a list of airlines', async () => {
      const res = await request(app).get('/api/v1/airlines?search=Test');
      expect(res.status).toBe(200);
      expect(res.body.data.some((a: { airline_name: string; }) => a.airline_name === 'Test Airline')).toBe(true);
   });
});
