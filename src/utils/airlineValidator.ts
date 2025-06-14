import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const airlinesQuerySchema = Joi.object({
   search: Joi.string().min(2).max(50).optional().trim(),
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
