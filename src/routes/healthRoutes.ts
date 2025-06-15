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

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica el estado de los servicios principales
 *     description: Retorna información de estado (health) para MySQL, Redis y Mailer, además de uptime y versión de Node.js.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Todos los servicios funcionan correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-15T02:18:49.805Z"
 *                 uptime:
 *                   type: number
 *                   example: 1234.567
 *                 node_version:
 *                   type: string
 *                   example: "v20.12.2"
 *                 services:
 *                   type: object
 *                   properties:
 *                     mysql:
 *                       type: string
 *                       example: ok
 *                     redis:
 *                       type: string
 *                       example: ok
 *                     mailer:
 *                       type: string
 *                       example: ok
 *       500:
 *         description: Uno o más servicios no están disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                 node_version:
 *                   type: string
 *                 services:
 *                   type: object
 *                   properties:
 *                     mysql:
 *                       type: string
 *                       example: fail
 *                     redis:
 *                       type: string
 *                       example: ko
 *                     mailer:
 *                       type: string
 *                       example: fail
 */

export default router;
