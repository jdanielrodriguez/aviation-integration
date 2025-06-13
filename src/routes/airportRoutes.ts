import { Router } from 'express';
import { getAirlines } from '../controllers/airportController';

const router = Router();

router.get('/', getAirlines);

export default router;
