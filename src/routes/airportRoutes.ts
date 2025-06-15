import { Router } from 'express';
import { getAirportsController } from '../controllers/airportController';
import { validateAirportQuery } from '../utils/airportValidator';

const router = Router();

router.get('/', validateAirportQuery, getAirportsController);

/**
 * @swagger
 * /api/v1/airports:
 *   get:
 *     summary: Retrieves a list of airports with optional search
 *     description: Returns airports, optionally filtered by name, IATA code, city, or country.
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
 *         description: Text to search by name, IATA code, city, or country
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
 *         description: List of airports found
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
