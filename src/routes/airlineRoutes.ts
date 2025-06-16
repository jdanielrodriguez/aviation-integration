import { Router } from 'express';
import { getAirlinesController } from '../controllers/airlineController';
import { validateAirlineQuery } from '../utils/airlineValidator';

const router = Router();

router.get('/', validateAirlineQuery, getAirlinesController);

/**
 * @swagger
 * /api/v1/airlines:
 *   get:
 *     summary: Retrieves a list of airlines with optional search
 *     description: Returns airlines, optionally filtered by name, IATA, ICAO, callsign, or country.
 *     tags:
 *       - Airlines
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         required: false
 *         description: Text to search by airline name, IATA, ICAO, callsign, or country
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *         required: false
 *         description: Maximum number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         required: false
 *         description: Results offset for pagination
 *     responses:
 *       200:
 *         description: List of airlines found
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
 *                       example: 13131
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       airline_name:
 *                         type: string
 *                         example: "American Airlines"
 *                       iata_code:
 *                         type: string
 *                         example: "AA"
 *                       icao_code:
 *                         type: string
 *                         example: "AAL"
 *                       callsign:
 *                         type: string
 *                         example: "AMERICAN"
 *                       type:
 *                         type: string
 *                         example: "scheduled"
 *                       status:
 *                         type: string
 *                         example: "active"
 *                       fleet_size:
 *                         type: string
 *                         example: "963"
 *                       fleet_average_age:
 *                         type: string
 *                         example: "10.9"
 *                       date_founded:
 *                         type: string
 *                         example: "1934"
 *                       hub_code:
 *                         type: string
 *                         example: "DFW"
 *                       iata_prefix_accounting:
 *                         type: string
 *                         example: "1"
 *                       country_name:
 *                         type: string
 *                         example: "United States"
 *                       country_iso2:
 *                         type: string
 *                         example: "US"
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
 *                             example: '"search" length must be at least 2 characters long'
 *                           path:
 *                             type: string
 *                             example: search
 */

export default router;
