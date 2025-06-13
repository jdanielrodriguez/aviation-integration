import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export function errorHandler(
   err: any,
   req: Request,
   res: Response,
   _next: NextFunction
) {
   logger.error('%O', err);

   const status = err.status || 500;
   res.status(status).json({
      error: {
         message: err.message || 'Error interno del servidor',
         status,
         stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
      }
   });
}
