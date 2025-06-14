import { Router } from 'express';
import { getAirlines } from '../controllers/airportController';
import { airlinesQuerySchema, validateQuery } from '../utils/airlineValidator';

const router = Router();

router.get(
   '/',
   validateQuery(airlinesQuerySchema),
   getAirlines
);

export default router;
