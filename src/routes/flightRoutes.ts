import { Router } from 'express';
import { getFlights } from '../controllers/flightController';

const router = Router();

router.get('/', getFlights);

export default router;
