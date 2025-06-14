import { Router } from 'express';
import { flightsQuerySchema, validateQuery } from '../utils/flightsValidator';
import { getFlights } from '../controllers/flightController';

const router = Router();

router.get(
   '/',
   validateQuery(flightsQuerySchema),
   getFlights
);

export default router;
