import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const schema = Joi.object({
   search: Joi.string().min(2).max(100).optional().trim(),
   limit: Joi.number().integer().min(1).max(1000).optional(),
   offset: Joi.number().integer().min(0).optional(),
});

export function validateAirportQuery(req: Request, res: Response, next: NextFunction) {
   const { error } = schema.validate(req.query, { abortEarly: false });
   if (error) {
      return next({
         status: 422,
         message: 'Error de validación',
         errors: error.details.map(d => ({
            msg: d.message,
            path: d.path.join('.'),
         }))
      });
   }
   next();
}
