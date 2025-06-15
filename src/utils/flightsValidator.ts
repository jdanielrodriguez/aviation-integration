import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const schema = Joi.object({
   dep_iata: Joi.string().min(2).uppercase(),
   arr_iata: Joi.string().min(2).uppercase(),
   flight_number: Joi.string(),
   flight_iata: Joi.string(),
   flight_icao: Joi.string(),
   flight_status: Joi.string().valid('scheduled', 'active', 'landed', 'cancelled', 'incident', 'diverted'),
   flight_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
   dep_icao: Joi.string().length(4).uppercase(),
   arr_icao: Joi.string().length(4).uppercase(),
   airline_name: Joi.string(),
   airline_iata: Joi.string().length(2).uppercase(),
   airline_icao: Joi.string().length(3).uppercase(),
   min_delay_dep: Joi.number().integer().min(0),
   max_delay_dep: Joi.number().integer().min(0),
   min_delay_arr: Joi.number().integer().min(0),
   max_delay_arr: Joi.number().integer().min(0),
   arr_scheduled_time_arr: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
   arr_scheduled_time_dep: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
   limit: Joi.number().integer().min(1).max(1000),
   offset: Joi.number().integer().min(0),
});

export function validateFlightQuery(req: Request, res: Response, next: NextFunction) {
   const { error } = schema.validate(req.query, { abortEarly: false });
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
