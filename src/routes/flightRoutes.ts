import { Router } from 'express';
import { getFlightsController } from '../controllers/flightController';
import { validateFlightQuery } from '../utils/flightsValidator';

const router = Router();

router.get('/', validateFlightQuery, getFlightsController);

/**
 * @swagger
 * /api/v1/flights:
 *   get:
 *     summary: Retrieves a list of filtered flights
 *     description: Returns flights based on optional filters such as IATA, ICAO, dates, status, delays, and more.
 *     tags:
 *       - Flights
 *     parameters:
 *       - in: query
 *         name: flight_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Flight date (YYYY-MM-DD)
 *       - in: query
 *         name: flight_status
 *         schema:
 *           type: string
 *           enum: [scheduled, active, landed, cancelled, incident, diverted]
 *         description: Flight status
 *       - in: query
 *         name: dep_iata
 *         schema:
 *           type: string
 *         description: Departure airport IATA code
 *       - in: query
 *         name: arr_iata
 *         schema:
 *           type: string
 *         description: Arrival airport IATA code
 *       - in: query
 *         name: dep_icao
 *         schema:
 *           type: string
 *         description: Departure airport ICAO code
 *       - in: query
 *         name: arr_icao
 *         schema:
 *           type: string
 *         description: Arrival airport ICAO code
 *       - in: query
 *         name: airline_name
 *         schema:
 *           type: string
 *         description: Airline name
 *       - in: query
 *         name: airline_iata
 *         schema:
 *           type: string
 *         description: Airline IATA code
 *       - in: query
 *         name: airline_icao
 *         schema:
 *           type: string
 *         description: Airline ICAO code
 *       - in: query
 *         name: flight_number
 *         schema:
 *           type: string
 *         description: Flight number
 *       - in: query
 *         name: flight_iata
 *         schema:
 *           type: string
 *         description: Flight IATA code
 *       - in: query
 *         name: flight_icao
 *         schema:
 *           type: string
 *         description: Flight ICAO code
 *       - in: query
 *         name: min_delay_dep
 *         schema:
 *           type: integer
 *         description: Minimum departure delay in minutes
 *       - in: query
 *         name: max_delay_dep
 *         schema:
 *           type: integer
 *         description: Maximum departure delay in minutes
 *       - in: query
 *         name: min_delay_arr
 *         schema:
 *           type: integer
 *         description: Minimum arrival delay in minutes
 *       - in: query
 *         name: max_delay_arr
 *         schema:
 *           type: integer
 *         description: Maximum arrival delay in minutes
 *       - in: query
 *         name: arr_scheduled_time_dep
 *         schema:
 *           type: string
 *           format: date
 *         description: Scheduled departure date
 *       - in: query
 *         name: arr_scheduled_time_arr
 *         schema:
 *           type: string
 *           format: date
 *         description: Scheduled arrival date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Result limit
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: List of flights found
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
 *         description: Validation error in parameters
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
 *                       example: Validation error
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
