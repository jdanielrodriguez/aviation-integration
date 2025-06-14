import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app, { redisClient } from '../../app';
import { AppDataSource } from '../../config/database';

beforeAll(async () => {
   if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
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

describe('Health endpoint', () => {
   it('debería responder 500 para errores internos', async () => {
      const res = await request(app).get('/api/test-error');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe('Error de prueba');
   });

   it('debería responder 422 si dep_iata es inválido', async () => {
      const res = await request(app)
         .get('/api/v1/flights?dep_iata=AA')
      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toContain('validación');
      expect(res.body.error.details).toBeDefined();
   });

   it('debería responder 422 si search es demasiado corto', async () => {
      const res = await request(app)
         .get('/api/v1/airlines?search=A');
      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toContain('validación');
      expect(res.body.error.details).toBeDefined();
      expect(res.body.error.details[0].msg).toContain('"search" length must be at least 2 characters long');
   });

   it('debería responder 400 por JSON inválido en el body', async () => {
      const res = await request(app)
         .post('/api/v1/flights')
         .set('Content-Type', 'application/json')
         .send('{"malformado": ');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toContain('JSON inválido');
   });

   it('debería responder 404 en ruta inexistente', async () => {
      const res = await request(app).get('/api/ruta-que-no-existe');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Ruta no encontrada');
   });

   it('debería responder ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
   });

   it('debería responder con el contenido del README.md en la raíz', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      const readmePath = path.join(__dirname, '../../../README.md');
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      expect(res.text).toContain(readmeContent.slice(0, 20));
   });
});
