import { Router } from 'express';
import { validateFlightQuery } from '../utils/flightsValidator';
import { getFlightsController } from '../controllers/flightController';

const router = Router();

router.get('/', validateFlightQuery, getFlightsController);

/**
 * @swagger
 * /api/v1/flights:
 *   get:
 *     summary: Obtiene una lista de vuelos filtrados
 *     description: Retorna vuelos según los filtros opcionales de aeropuerto de salida/llegada y número de vuelo.
 *     tags:
 *       - Flights
 *     parameters:
 *       - in: query
 *         name: dep_iata
 *         schema:
 *           type: string
 *           minLength: 3
 *           maxLength: 3
 *         required: false
 *         description: 'Código IATA de aeropuerto de salida (ejemplo: GUA)'
 *       - in: query
 *         name: arr_iata
 *         schema:
 *           type: string
 *           minLength: 3
 *           maxLength: 3
 *         required: false
 *         description: 'Código IATA de aeropuerto de llegada (ejemplo: JFK)'
 *       - in: query
 *         name: flight_number
 *         schema:
 *           type: string
 *         required: false
 *         description: Número de vuelo
 *     responses:
 *       200:
 *         description: Lista de vuelos encontrada
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
 *                     offset:
 *                       type: integer
 *                     count:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       flight_number:
 *                         type: string
 *                         example: "AA123"
 *                       dep_iata:
 *                         type: string
 *                         example: "GUA"
 *                       arr_iata:
 *                         type: string
 *                         example: "JFK"
 *                       airline:
 *                         type: string
 *                         example: "American Airlines"
 *                       status:
 *                         type: string
 *                         example: "active"
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
 *                             example: '"dep_iata" length must be 3 characters long'
 *                           path:
 *                             type: string
 *                             example: dep_iata
 */

export default router;
