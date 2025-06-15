import { Request, Response, NextFunction } from 'express';
import { syncFlightsIfNeeded, logApiCall } from '../services/aviationStackService';
import { getFlightsFromDb } from '../services/flightQueryService';
import { FlightQueryParams } from '../types/flight';

export const getFlightsController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      await syncFlightsIfNeeded(); 
      const result = await getFlightsFromDb(req.query as FlightQueryParams);
      await logApiCall('flights', req.query, result, 200);
      res.json(result);
   } catch (error) {
      next(error);
   }
};
