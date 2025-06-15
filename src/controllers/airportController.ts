import { Request, Response, NextFunction } from 'express';
import { syncAirportsIfNeeded, logApiCall } from '../services/aviationStackService';
import { getAirportsFromDb } from '../services/airportQueryService';
import { AirportQueryParams } from '../types/airport';

export const getAirportsController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      await syncAirportsIfNeeded();
      const result = await getAirportsFromDb(req.query as AirportQueryParams);
      await logApiCall('airports', req.query, result, 200);
      res.json(result);
   } catch (error) {
      next(error);
   }
};


