import { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from 'express';
import logger from '../config/logger';

export const errorHandler: ErrorRequestHandler = (
   err: any,
   req: Request,
   res: Response,
   _next: NextFunction) => {
   logger.error('[%s] %s - %O', req.method, req.originalUrl, err);

   if (err instanceof SyntaxError && 'body' in err) {
      res.status(400).json({
         error: {
            message: 'Invalid JSON in the request body',
            status: 400
         }
      });
      return;
   }

   if (Array.isArray((err as any).errors)) {
      res.status(422).json({
         error: {
            message: 'Validation error',
            status: 422,
            details: (err as any).errors
         }
      });
      return;
   }

   const status = typeof err.status === 'number' && err.status >= 100 && err.status < 600
      ? err.status
      : 500;

   res.status(status).json({
      error: {
         message: err.message || 'Internal Server Error',
         status,
         stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
      }
   });
};
