import { Router } from 'express';
import { getAirportsController } from '../controllers/airportController';
import { validateAirportQuery } from '../utils/airportValidator';

const router = Router();

router.get('/', validateAirportQuery, getAirportsController);

/**
 * @swagger
 * /api/v1/airports:
 *   get:
 *     summary: Obtiene una lista de aeropuertos (con búsqueda opcional)
 *     description: Retorna aeropuertos, filtrados opcionalmente por el parámetro de búsqueda.
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
 *         description: Palabra clave para buscar aeropuertos por nombre, IATA o ciudad.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *         required: false
 *         description: Número máximo de resultados a retornar.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         required: false
 *         description: Desplazamiento de resultados para paginación.
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
 *                         example: "Anaa"
 *                       iata_code:
 *                         type: string
 *                         example: "AAA"
 *                       icao_code:
 *                         type: string
 *                         example: "NTGA"
 *                       latitude:
 *                         type: string
 *                         example: "-17.05"
 *                       longitude:
 *                         type: string
 *                         example: "-145.41667"
 *                       country_name:
 *                         type: string
 *                         example: "French Polynesia"
 *                       timezone:
 *                         type: string
 *                         example: "Pacific/Tahiti"
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
