import { Router } from 'express';
import { getAirlinesController } from '../controllers/airlineController';
import { validateAirlineQuery } from '../utils/airlineValidator';

const router = Router();

router.get('/', validateAirlineQuery, getAirlinesController);

export default router;
