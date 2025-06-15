import { Router } from 'express';
import { getFlightsController } from '../controllers/flightController';
import { validateFlightQuery } from '../utils/flightsValidator';

const router = Router();

router.get('/', validateFlightQuery, getFlightsController);
/**
 * @swagger
 * /api/v1/flights:
 *   get:
 *     summary: Obtiene una lista de vuelos filtrados
 *     description: Retorna vuelos según los filtros opcionales como IATA, ICAO, fechas, estatus, delays y otros.
 *     tags:
 *       - Flights
 *     parameters:
 *       - in: query
 *         name: flight_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha del vuelo (YYYY-MM-DD)
 *       - in: query
 *         name: flight_status
 *         schema:
 *           type: string
 *           enum: [scheduled, active, landed, cancelled, incident, diverted]
 *         description: Estado del vuelo
 *       - in: query
 *         name: dep_iata
 *         schema:
 *           type: string
 *         description: Código IATA del aeropuerto de salida
 *       - in: query
 *         name: arr_iata
 *         schema:
 *           type: string
 *         description: Código IATA del aeropuerto de llegada
 *       - in: query
 *         name: dep_icao
 *         schema:
 *           type: string
 *         description: Código ICAO del aeropuerto de salida
 *       - in: query
 *         name: arr_icao
 *         schema:
 *           type: string
 *         description: Código ICAO del aeropuerto de llegada
 *       - in: query
 *         name: airline_name
 *         schema:
 *           type: string
 *         description: Nombre de la aerolínea
 *       - in: query
 *         name: airline_iata
 *         schema:
 *           type: string
 *         description: Código IATA de la aerolínea
 *       - in: query
 *         name: airline_icao
 *         schema:
 *           type: string
 *         description: Código ICAO de la aerolínea
 *       - in: query
 *         name: flight_number
 *         schema:
 *           type: string
 *         description: Número del vuelo
 *       - in: query
 *         name: flight_iata
 *         schema:
 *           type: string
 *         description: Código IATA del vuelo
 *       - in: query
 *         name: flight_icao
 *         schema:
 *           type: string
 *         description: Código ICAO del vuelo
 *       - in: query
 *         name: min_delay_dep
 *         schema:
 *           type: integer
 *         description: Minutos mínimos de retraso en salida
 *       - in: query
 *         name: max_delay_dep
 *         schema:
 *           type: integer
 *         description: Minutos máximos de retraso en salida
 *       - in: query
 *         name: min_delay_arr
 *         schema:
 *           type: integer
 *         description: Minutos mínimos de retraso en llegada
 *       - in: query
 *         name: max_delay_arr
 *         schema:
 *           type: integer
 *         description: Minutos máximos de retraso en llegada
 *       - in: query
 *         name: arr_scheduled_time_dep
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha programada de salida
 *       - in: query
 *         name: arr_scheduled_time_arr
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha programada de llegada
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset para paginación
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
 *                       flight_status:
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
