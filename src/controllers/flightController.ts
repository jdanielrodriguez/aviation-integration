import { Request, Response, NextFunction } from 'express';

export const getFlights = async (req: Request, res: Response, next: NextFunction) => {
   try {
      res.json({ message: 'Lista de vuelos' });
   } catch (error) {
      next(error);
   }
};
