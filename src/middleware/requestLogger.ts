import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
   const hasBody = req.body && Object.keys(req.body).length > 0;
   const hasQuery = req.query && Object.keys(req.query).length > 0;

   if (hasBody || hasQuery) {
      logger.info(
         `[${req.method}] ${req.originalUrl} -${hasBody ? ' Body: ' + JSON.stringify(req.body) : ''}${hasQuery ? ' Query: ' + JSON.stringify(req.query) : ''}`
      );
   }

   res.on('finish', () => {
      logger.info(`[${req.method}] ${req.originalUrl} - Status: ${res.statusCode}`);
   });
   next();
}
