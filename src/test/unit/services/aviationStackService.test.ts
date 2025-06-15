import { redisClient, mailer } from '../../../app';
import { AppDataSource } from '../../../config/database';
import { MOCK_FLIGHTS } from '../../../test/mocks/aviationData';
import { ApiCall } from '../../../models/apiCall';
import { config } from '../../../config/api';

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

describe('aviationStackService - getFlights() (unit)', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });
   jest.mock('../../../config/database', () => {
      return {
         AppDataSource: {
            getRepository: jest.fn()
         }
      };
   });
   it('should return mocked flights in test env', async () => {
      process.env.NODE_ENV = 'test';
      const { getFlights } = require('../../../services/aviationStackService');
      const res = await getFlights({});
      expect(res.data).toEqual(MOCK_FLIGHTS);
   });

   it('should return mocked airports in test env', async () => {
      process.env.NODE_ENV = 'test';
      const { getAirports } = require('../../../services/aviationStackService');
      const res = await getAirports({});
      expect(Array.isArray(res.data)).toBe(true);
   });

   it('should NOT sync flights/airports in test env', async () => {
      process.env.NODE_ENV = 'test';
      const { syncFlightsIfNeeded, syncAirportsIfNeeded } = require('../../../services/aviationStackService');
      await expect(syncFlightsIfNeeded()).resolves.toBeUndefined();
      await expect(syncAirportsIfNeeded()).resolves.toBeUndefined();
   });

   it('should log an API call', async () => {
      const repo = AppDataSource.getRepository(ApiCall);
      const { logApiCall } = require('../../../services/aviationStackService');
      const spy = jest.spyOn(repo, 'save').mockResolvedValueOnce({
         id: 1,
         endpoint: 'flights',
         parameters: {},
         response: {},
         status_code: 200,
         timestamp: new Date()
      });
      await logApiCall('flights', { dep_iata: 'GUA' }, { foo: 'bar' }, 200);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
   });

   it('should hit cache if available', async () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      const { getFlights } = require('../../../services/aviationStackService');
      const params = {};
      const queryStr = new URLSearchParams(
         Object.fromEntries(Object.entries({ access_key: config.AVIATIONSTACK_KEY, ...params }).filter(([, v]) => v !== undefined))
      ).toString();
      const cacheKey = `flights:${queryStr}`;
      // This is what you should use to set the value in cache, so it's the same for sure
      await redisClient.set(cacheKey, JSON.stringify({ data: [{ flight_status: 'from-cache' }] }));
      const res = await getFlights({});
      expect(res.data[0].flight_status).toBe('from-cache');
      await redisClient.del(cacheKey);

   });

   it('should throw error and send mail if axios fails (non-test env)', async () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      jest.mock('../../../utils/emailSender', () => ({
         sendAdminEmail: jest.fn()
      }));
      const axios = require('axios');
      axios.get = jest.fn().mockRejectedValueOnce(new Error('fail!'));
      const { getFlights } = require('../../../services/aviationStackService');
      const { sendAdminEmail } = require('../../../utils/emailSender');
      await expect(getFlights({})).rejects.toThrow('External API unavailable');
      expect(sendAdminEmail).toHaveBeenCalled();
   });

   it('getFromCache returns null if value does not exist', async () => {
      // Force mock in redis
      const { redisClient } = require('../../../app');
      redisClient.get = jest.fn().mockResolvedValueOnce(null);
      const { getFromCache } = require('../../../services/aviationStackService');
      const value = await getFromCache('non-existing-key');
      expect(value).toBeNull();
   });

   it('getFromCache returns parsed object if exists', async () => {
      const { redisClient } = require('../../../app');
      redisClient.get = jest.fn().mockResolvedValueOnce(JSON.stringify({ foo: 123 }));
      const { getFromCache } = require('../../../services/aviationStackService');
      const value = await getFromCache('key');
      expect(value).toEqual({ foo: 123 });
   });

   it('setCache saves correctly in redis', async () => {
      const { redisClient } = require('../../../app');
      redisClient.setEx = jest.fn().mockResolvedValueOnce('OK');
      const { setCache } = require('../../../services/aviationStackService');
      await setCache('key', { z: 2 }, 55);
      expect(redisClient.setEx).toHaveBeenCalledWith('key', 55, JSON.stringify({ z: 2 }));
   });

   it('hasSyncedToday returns true if there is ApiCall today', async () => {
      const findOneMock = jest.fn().mockResolvedValueOnce({
         id: 1,
         endpoint: 'flights',
         parameters: {},
         response: {},
         status_code: 200,
         timestamp: new Date()
      });
      const fakeRepo = { findOne: findOneMock };
      const { AppDataSource } = require('../../../config/database');
      AppDataSource.getRepository.mockReturnValue(fakeRepo);

      const { hasSyncedToday } = require('../../../services/aviationStackService');
      const res = await hasSyncedToday('flights');
      expect(res).toBe(true);
   });

   it('hasSyncedToday returns false if there is no ApiCall today', async () => {
      jest.doMock('../../../config/database', () => ({
         AppDataSource: {
            getRepository: jest.fn().mockReturnValue({
               findOne: jest.fn().mockResolvedValueOnce(null)
            })
         }
      }));

      const { hasSyncedToday } = require('../../../services/aviationStackService');
      const res = await hasSyncedToday('flights');
      expect(res).toBe(false);

      jest.resetModules();
   });

   it('logApiCall throws error if repo fails', async () => {
      jest.doMock('../../../config/database', () => ({
         AppDataSource: {
            getRepository: jest.fn().mockReturnValue({
               create: jest.fn().mockReturnValue({}),
               save: jest.fn().mockRejectedValueOnce(new Error('DB fail'))
            })
         }
      }));

      const { logApiCall } = require('../../../services/aviationStackService');
      await expect(logApiCall('flights', {}, {}, 200)).rejects.toThrow('DB fail');

      jest.resetModules();
   });

   it('syncFlightsIfNeeded does early return if isTestEnv=true', async () => {
      process.env.NODE_ENV = 'test';
      jest.resetModules();
      const { syncFlightsIfNeeded } = require('../../../services/aviationStackService');
      const result = await syncFlightsIfNeeded();
      expect(result).toBeUndefined();
   });

   it('syncAirportsIfNeeded does early return if isTestEnv=true', async () => {
      process.env.NODE_ENV = 'test';
      jest.resetModules();
      const { syncAirportsIfNeeded } = require('../../../services/aviationStackService');
      const result = await syncAirportsIfNeeded();
      expect(result).toBeUndefined();
   });

   it('should throw error if setCache fails', async () => {
      const { setCache } = require('../../../services/aviationStackService');
      const { redisClient } = require('../../../app');
      redisClient.setEx = jest.fn().mockRejectedValueOnce(new Error('Redis fail'));
      await expect(setCache('key', { x: 1 }, 90)).rejects.toThrow('Redis fail');
   });

   it('syncFlightsIfNeeded early returns if already synced', async () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();

      const fakeRepo = { findOne: jest.fn().mockResolvedValueOnce(true) };
      const AppDataSource = require('../../../config/database').AppDataSource;
      AppDataSource.getRepository = jest.fn().mockReturnValue(fakeRepo);

      const aviationStackService = require('../../../services/aviationStackService');
      const result = await aviationStackService.syncFlightsIfNeeded();
      expect(result).toBeUndefined();
   });

   it('fetch should throw if sendAdminEmail fails', async () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      const axios = require('axios');
      axios.get = jest.fn().mockRejectedValueOnce(new Error('axios fail'));
      const { sendAdminEmail } = require('../../../utils/emailSender');
      sendAdminEmail.mockImplementationOnce(() => { throw new Error('mailer fail'); });
      const { getFlights } = require('../../../services/aviationStackService');
      await expect(getFlights({})).rejects.toThrow('mailer fail');
   });

   it('syncAirportsIfNeeded handles invalid latitude/longitude', async () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();

      const fakeRepo = {
         findOne: jest.fn().mockResolvedValueOnce(null),
         upsert: jest.fn().mockResolvedValueOnce(undefined)
      };
      const AppDataSource = require('../../../config/database').AppDataSource;
      AppDataSource.getRepository = jest.fn().mockReturnValue(fakeRepo);

      const aviationStackModule = require('../../../services/aviationStackService');
      jest.spyOn(aviationStackModule, 'getAirports').mockResolvedValueOnce({
         data: [{
            airport_name: 'X',
            iata_code: 'XX',
            icao_code: 'XXX',
            latitude: 'no-num',
            longitude: 'another-num',
            timezone: '', gmt: '', country_name: '', country_iso2: '', city_iata_code: ''
         }]
      });

      await aviationStackModule.syncAirportsIfNeeded();

      expect(fakeRepo.upsert).toHaveBeenCalledWith(
         expect.objectContaining({ latitude: NaN, longitude: NaN }),
         ['iata_code']
      );

      process.env.NODE_ENV = 'test';
   });
});
