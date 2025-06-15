import { Router } from 'express';
import { getAirportsController } from '../controllers/airportController';
import { validateAirportQuery } from '../utils/airportValidator';

const router = Router();

router.get('/', validateAirportQuery, getAirportsController);

/**
 * @swagger
 * /api/v1/airports:
 *   get:
 *     summary: Obtiene una lista de aeropuertos con búsqueda opcional
 *     description: Retorna aeropuertos, filtrados opcionalmente por nombre, código IATA, ciudad o país.
 *     tags:
 *       - Airports
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         required: false
 *         description: Texto para buscar por nombre, IATA, ciudad o país
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *         required: false
 *         description: Cantidad máxima de resultados
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         required: false
 *         description: Desplazamiento de resultados para paginación
 *     responses:
 *       200:
 *         description: Lista de aeropuertos encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                       example: 100
 *                     offset:
 *                       type: integer
 *                       example: 0
 *                     count:
 *                       type: integer
 *                       example: 100
 *                     total:
 *                       type: integer
 *                       example: 6471
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       airport_name:
 *                         type: string
 *                         example: "Quetzaltenango"
 *                       iata_code:
 *                         type: string
 *                         example: "AAZ"
 *                       icao_code:
 *                         type: string
 *                         example: "MGQZ"
 *                       latitude:
 *                         type: string
 *                         example: "14.870000"
 *                       longitude:
 *                         type: string
 *                         example: "-91.500000"
 *                       timezone:
 *                         type: string
 *                         example: "America/Guatemala"
 *                       gmt:
 *                         type: string
 *                         example: "-6"
 *                       country_name:
 *                         type: string
 *                         example: "Guatemala"
 *                       country_iso2:
 *                         type: string
 *                         example: "GT"
 *                       city_iata_code:
 *                         type: string
 *                         example: "AAZ"
 *       422:
 *         description: Error de validación en los parámetros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Error de validación
 *                     status:
 *                       type: number
 *                       example: 422
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           msg:
 *                             type: string
 *                             example: '"search" length must be at least 2 characters long'
 *                           path:
 *                             type: string
 *                             example: search
 */

export default router;
