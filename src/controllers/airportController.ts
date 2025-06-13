import { Request, Response, NextFunction } from 'express';

export const getAirlines = async (req: Request, res: Response, next: NextFunction) => {
   try {
      res.json({ message: 'Lista de aerolíneas' });
   } catch (error) {
      next(error);
   }
};