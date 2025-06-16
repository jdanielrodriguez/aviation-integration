import { Request, Response, NextFunction } from 'express';
import { syncAirlinesIfNeeded, logApiCall } from '../services/aviationStackService';
import { getAirlinesFromDb } from '../services/airlineQueryService';
import { AirlineQueryParams } from '../types/airline';

export const getAirlinesController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      await syncAirlinesIfNeeded();
      const result = await getAirlinesFromDb(req.query as AirlineQueryParams);
      await logApiCall('airlines', req.query, result, 200);
      res.json(result);
   } catch (error) {
      next(error);
   }
};
