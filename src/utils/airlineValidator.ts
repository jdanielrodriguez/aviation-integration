import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const airlineSchema = Joi.object({
   search: Joi.string().min(2).max(100).optional().trim(),
   limit: Joi.number().integer().min(1).max(1000).optional(),
   offset: Joi.number().integer().min(0).optional(),
});

export function validateAirlineQuery(req: Request, res: Response, next: NextFunction) {
   const { error } = airlineSchema.validate(req.query, { abortEarly: false });
   if (error) {
      return next({
         status: 422,
         message: 'Validation error',
         errors: error.details.map(d => ({
            msg: d.message,
            path: d.path.join('.'),
         }))
      });
   }
   next();
}
