import { Router } from 'express';
import { redisClient, mailer } from '../app';
import logger from '../config/logger';

import { AppDataSource } from '../config/database';

const router = Router();

router.get('/', async (_req, res) => {
   const health: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      node_version: process.version,
      services: {},
   };

   // --- MySQL ---
   try {
      if (!AppDataSource.isInitialized) {
         await AppDataSource.initialize();
      }
      await AppDataSource.query('SELECT 1');
      health.services.mysql = 'ok';
   } catch (e) {
      health.services.mysql = 'fail';
      logger.error('MySQL Health fail', e);
   }

   // --- Redis ---
   try {
      if (redisClient.isOpen) {
         await redisClient.ping();
         health.services.redis = 'ok';
      } else {
         health.services.redis = 'ko';
         logger.error('Redis no está abierto');
      }
   } catch (e) {
      health.services.redis = 'fail';
      logger.error('Redis Health fail', e);
   }

   // --- Mailer ---
   try {
      if (mailer) {
         await mailer.verify();
         health.services.mailer = 'ok';
      } else {
         health.services.mailer = 'ko';
      }
   } catch (e) {
      health.services.mailer = 'fail';
      logger.error('Mailer Health fail', e);
   }

   res.status(health.services.mysql === 'ok' && health.services.redis === 'ok' && health.services.mailer === 'ok' ? 200 : 500).json(health);
});

export default router;
