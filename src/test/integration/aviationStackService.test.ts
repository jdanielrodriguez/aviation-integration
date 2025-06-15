import { getFlights, logApiCall } from '../../services/aviationStackService';
import { AppDataSource } from '../../config/database';
import { redisClient } from '../../app';
import { ApiCall } from '../../models/apiCall';
import { config } from '../../config/api';

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
});

describe('aviationStackService integration', () => {
   it('saves an ApiCall entry', async () => {
      const repo = AppDataSource.getRepository(ApiCall);
      const before = await repo.count();
      await logApiCall('flights', { dep_iata: 'GUA' }, { foo: 'bar' }, 200);
      const after = await repo.count();
      expect(after).toBeGreaterThan(before);
   });

   it('returns data from cache when available', async () => {
      const params = {};
      const queryStr = new URLSearchParams(
         Object.fromEntries(
            Object.entries({ access_key: config.AVIATIONSTACK_KEY, ...params }).filter(
               ([, v]) => v !== undefined
            )
         ) as Record<string, string>
      ).toString();
      const key = `flights:${queryStr}`;
      await redisClient.setEx(key, 100, JSON.stringify({ data: [{ flight_status: 'from-cache' }] }));

      const res = await getFlights({});
      expect(res.data[0].flight_status).toBe('from-cache');
      await redisClient.del(key);
   });

   it('throws an error if the external API fails', async () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      const axios = require('axios');
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('fail!'));

      const { getFlights } = require('../../services/aviationStackService');
      await expect(getFlights({})).rejects.toThrow('External API unavailable');
      axios.get.mockRestore();
      process.env.NODE_ENV = 'test';
   });
});
