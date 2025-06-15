import { schema as airportQuerySchema } from '../../../utils/airportValidator';

describe('airportValidator', () => {
   it('should accept a valid query', () => {
      const query = { search: 'guatemala', limit: 10, offset: 0 };
      const { error } = airportQuerySchema.validate(query);
      expect(error).toBeUndefined();
   });

   it('should reject a too short search', () => {
      const query = { search: 'a' };
      const { error } = airportQuerySchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/length must be at least 2/);
   });

   it('should reject limit if it is negative or zero', () => {
      const query = { limit: 0 };
      const { error } = airportQuerySchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/must be greater than or equal to 1/);
   });

   it('should reject negative offset', () => {
      const query = { offset: -5 };
      const { error } = airportQuerySchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/must be greater than or equal to 0/);
   });
});
