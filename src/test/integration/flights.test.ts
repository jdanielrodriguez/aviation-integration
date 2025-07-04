import request from 'supertest';
import app, { redisClient, mailer } from '../../app';
import { AppDataSource } from '../../config/database';

beforeAll(async () => {
   if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      await AppDataSource.runMigrations();
   }
   if (redisClient && !redisClient.isOpen) {
      await redisClient.connect();
   }
});

afterAll(async () => {
   if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
   }
   if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
   }
   if (mailer && typeof mailer.close === 'function') {
      mailer.close();
   }
});

describe('GET /api/v1/flights', () => {
   it('should return flights from local DB (mocked)', async () => {
      const res = await request(app).get('/api/v1/flights?dep_iata=GUA');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
   });
});
