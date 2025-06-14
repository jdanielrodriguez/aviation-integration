import { Request, Response, NextFunction } from 'express';
import { getFlights } from '../services/aviationStackService';
import { FlightQueryParams } from '../types/flight';

export const getFlightsController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const data = await getFlights(req.query as FlightQueryParams);
      res.status(200).json(data);
   } catch (error) {
      next(error);
   }
};
