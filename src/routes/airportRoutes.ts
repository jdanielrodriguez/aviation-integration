import { Router } from 'express';
import { getAirlines } from '../controllers/airportController';
import { airlinesQuerySchema, validateQuery } from '../utils/airlineValidator';

const router = Router();

router.get(
   '/',
   validateQuery(airlinesQuerySchema),
   getAirlines
);

/**
 * @swagger
 * /api/v1/airlines:
 *   get:
 *     summary: Obtiene una lista de aerolíneas (con búsqueda opcional)
 *     description: Retorna aerolíneas, filtradas opcionalmente por el parámetro de búsqueda.
 *     tags:
 *       - Airlines
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         required: false
 *         description: Palabra clave para buscar aerolíneas por nombre.
 *     responses:
 *       200:
 *         description: Lista de aerolíneas encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   iata_code:
 *                     type: string
 *                     example: "AA"
 *                   name:
 *                     type: string
 *                     example: "American Airlines"
 *                   country:
 *                     type: string
 *                     example: "United States"
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
 *                     details:
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
