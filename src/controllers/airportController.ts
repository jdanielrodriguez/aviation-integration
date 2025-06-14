import { Request, Response, NextFunction } from 'express';
import { getAirports } from '../services/aviationStackService';
import { AirportQueryParams } from '../types/airport';

export const getAirportsController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const data = await getAirports(req.query as AirportQueryParams);
      res.status(200).json(data);
   } catch (error) {
      next(error);
   }
};

