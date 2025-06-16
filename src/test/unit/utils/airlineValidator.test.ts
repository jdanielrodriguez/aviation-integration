import { airlineSchema, validateAirlineQuery } from '../../../utils/airlineValidator';

describe('airlineValidator', () => {
   it('should accept a valid query', () => {
      const query = { search: 'Mock Airline', limit: 10, offset: 0 };
      const { error } = airlineSchema.validate(query);
      expect(error).toBeUndefined();
   });

   it('should accept a query with only search', () => {
      const query = { search: 'Mock Airline' };
      const { error } = airlineSchema.validate(query);
      expect(error).toBeUndefined();
   });

   it('should accept a query with only limit', () => {
      const query = { limit: 10 };
      const { error } = airlineSchema.validate(query);
      expect(error).toBeUndefined();
   });

   it('should accept a query with only offset', () => {
      const query = { offset: 0 };
      const { error } = airlineSchema.validate(query);
      expect(error).toBeUndefined();
   });

   it('should accept empty query (all optional)', () => {
      const query = {};
      const { error } = airlineSchema.validate(query);
      expect(error).toBeUndefined();
   });

   it('should reject too short search', () => {
      const query = { search: 'a' };
      const { error } = airlineSchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/length must be at least 2/);
   });

   it('should reject too long search', () => {
      const query = { search: 'a'.repeat(101) };
      const { error } = airlineSchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/length must be less than or equal to 100/);
   });

   it('should reject negative or zero limit', () => {
      const query = { limit: 0 };
      const { error } = airlineSchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/must be greater than or equal to 1/);
   });

   it('should reject too high limit', () => {
      const query = { limit: 1001 };
      const { error } = airlineSchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/must be less than or equal to 1000/);
   });

   it('should reject negative offset', () => {
      const query = { offset: -5 };
      const { error } = airlineSchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/must be greater than or equal to 0/);
   });

   it('should call next() with error object if validation fails', () => {
      const req: any = { query: { search: 'a' } }; // search muy corto
      const res: any = {};
      const next = jest.fn();

      validateAirlineQuery(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
         status: 422,
         message: 'Validation error',
         errors: expect.any(Array)
      }));
      // También puedes checar el mensaje del error:
      expect(next.mock.calls[0][0].errors[0].msg).toMatch(/length must be at least 2/);
   });

   it('should call next() without arguments if validation passes', () => {
      const req: any = { query: { search: 'Valid Airline' } };
      const res: any = {};
      const next = jest.fn();

      validateAirlineQuery(req, res, next);

      expect(next).toHaveBeenCalledWith(); // next() sin argumentos
   });
});
