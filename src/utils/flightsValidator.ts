import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const flightsQuerySchema = Joi.object({
   dep_iata: Joi.string().length(3).optional().uppercase(),
   arr_iata: Joi.string().length(3).optional().uppercase(),
   flight_number: Joi.string().optional(),
});

export function validateQuery(schema: Joi.ObjectSchema) {
   return (req: Request, res: Response, next: NextFunction) => {
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
   };
}
