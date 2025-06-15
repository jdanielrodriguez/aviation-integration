import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app, { redisClient, mailer } from '../../app';
import { AppDataSource } from '../../config/database';
import logger from '../../config/logger';

beforeAll(async () => {
   if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
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

describe('Health endpoint', () => {
   const originalRedisClient = redisClient;
   it('should respond 500 for internal errors', async () => {
      const res = await request(app).get('/api/test-error');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe('Test error');
   });

   it('should respond 422 if dep_iata is invalid', async () => {
      const res = await request(app)
         .get('/api/v1/flights?dep_iata=A')
      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toContain('Validation');
      expect(res.body.error.details).toBeDefined();
   });

   it('should respond 422 if search is too short', async () => {
      const res = await request(app)
         .get('/api/v1/airports?search=A');
      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toContain('Validation');
      expect(res.body.error.details).toBeDefined();
      expect(res.body.error.details[0].msg).toContain('"search" length must be at least 2 characters long');
   });

   it('should respond 400 for invalid JSON in the body', async () => {
      const res = await request(app)
         .post('/api/v1/flights')
         .set('Content-Type', 'application/json')
         .send('{"malformado": ');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toContain('Invalid JSON');
   });

   it('should respond 404 for nonexistent route', async () => {
      const res = await request(app).get('/api/route-that-does-not-exist');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Route not found');
   });

   it('should respond ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
   });

   it('should respond with the content of README.md at root', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      const readmePath = path.join(__dirname, '../../../README.md');
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      expect(res.text).toContain(readmeContent.slice(0, 20));
   });

   it('should respond 500 if MySQL fails', async () => {
      const oldQuery = AppDataSource.query;
      AppDataSource.query = jest.fn().mockRejectedValue(new Error('DB fail'));
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(500);
      expect(res.body.services.mysql).toBe('fail');
      AppDataSource.query = oldQuery;
   });

   it('should respond 500 if Redis is closed', async () => {
      const spy = jest.spyOn(redisClient, 'isOpen', 'get').mockReturnValue(false);
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(500);
      expect(res.body.services.redis).not.toBe('ok');
      spy.mockRestore();
   });

   it('should respond 500 if Mailer fails', async () => {
      if (!mailer) return;
      const originalVerify = mailer.verify;
      mailer.verify = jest.fn().mockImplementation((cb?: any) => {
         if (cb) return cb(new Error('fail'));
         return Promise.reject(new Error('fail'));
      });
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(500);
      expect(res.body.services.mailer).toBe('fail');
      mailer.verify = originalVerify;
   });

   it('should respond 500 if mailer is null', async () => {
      jest.resetModules();
      jest.doMock('../../app', () => ({
         ...jest.requireActual('../../app'),
         mailer: null,
      }));
      const mockApp = require('../../app').default;
      const res = await request(mockApp).get('/api/health');
      expect(res.status).toBe(500);
      expect(res.body.services.mailer).not.toBe('ok');
      jest.resetModules();
   });
});
