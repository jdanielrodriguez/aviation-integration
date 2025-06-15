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
      // Esto es lo que debes usar para setear el valor en cache, así seguro es igual
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

   it('getFromCache retorna null si el valor no existe', async () => {
      // Forzar mock en redis
      const { redisClient } = require('../../../app');
      redisClient.get = jest.fn().mockResolvedValueOnce(null);
      const { getFromCache } = require('../../../services/aviationStackService');
      const value = await getFromCache('llave-inexistente');
      expect(value).toBeNull();
   });

   it('getFromCache retorna objeto parseado si existe', async () => {
      const { redisClient } = require('../../../app');
      redisClient.get = jest.fn().mockResolvedValueOnce(JSON.stringify({ foo: 123 }));
      const { getFromCache } = require('../../../services/aviationStackService');
      const value = await getFromCache('llave');
      expect(value).toEqual({ foo: 123 });
   });

   it('setCache guarda correctamente en redis', async () => {
      const { redisClient } = require('../../../app');
      redisClient.setEx = jest.fn().mockResolvedValueOnce('OK');
      const { setCache } = require('../../../services/aviationStackService');
      await setCache('clave', { z: 2 }, 55);
      expect(redisClient.setEx).toHaveBeenCalledWith('clave', 55, JSON.stringify({ z: 2 }));
   });

   it('hasSyncedToday retorna true si hay ApiCall hoy', async () => {
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

   it('hasSyncedToday retorna false si no hay ApiCall hoy', async () => {
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

   it('logApiCall lanza error si falla el repo', async () => {
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

   it('syncFlightsIfNeeded hace early return si isTestEnv=true', async () => {
      process.env.NODE_ENV = 'test';
      jest.resetModules();
      const { syncFlightsIfNeeded } = require('../../../services/aviationStackService');
      const result = await syncFlightsIfNeeded();
      expect(result).toBeUndefined();
   });

   it('syncAirportsIfNeeded hace early return si isTestEnv=true', async () => {
      process.env.NODE_ENV = 'test';
      jest.resetModules();
      const { syncAirportsIfNeeded } = require('../../../services/aviationStackService');
      const result = await syncAirportsIfNeeded();
      expect(result).toBeUndefined();
   });

   it('debería lanzar error si setCache falla', async () => {
      const { setCache } = require('../../../services/aviationStackService');
      const { redisClient } = require('../../../app');
      redisClient.setEx = jest.fn().mockRejectedValueOnce(new Error('Redis fail'));
      await expect(setCache('clave', { x: 1 }, 90)).rejects.toThrow('Redis fail');
   });

   it('syncFlightsIfNeeded early return si ya está sincronizado', async () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();

      const fakeRepo = { findOne: jest.fn().mockResolvedValueOnce(true) };
      const AppDataSource = require('../../../config/database').AppDataSource;
      AppDataSource.getRepository = jest.fn().mockReturnValue(fakeRepo);

      const aviationStackService = require('../../../services/aviationStackService');
      const result = await aviationStackService.syncFlightsIfNeeded();
      expect(result).toBeUndefined();
   });

   it('fetch debería lanzar si sendAdminEmail falla', async () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      const axios = require('axios');
      axios.get = jest.fn().mockRejectedValueOnce(new Error('axios fail'));
      const { sendAdminEmail } = require('../../../utils/emailSender');
      sendAdminEmail.mockImplementationOnce(() => { throw new Error('mailer fail'); });
      const { getFlights } = require('../../../services/aviationStackService');
      await expect(getFlights({})).rejects.toThrow('mailer fail');
   });

   it('syncAirportsIfNeeded maneja latitude/longitude inválidos', async () => {
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
            longitude: 'otra-num',
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
