import { schema as flightsQuerySchema } from '../../../utils/flightsValidator';

describe('flightsValidator', () => {
   it('should accept a valid query', () => {
      const query = { dep_iata: 'GUA', arr_iata: 'JFK', flight_number: '123' };
      const { error } = flightsQuerySchema.validate(query);
      expect(error).toBeUndefined();
   });

   it('should reject dep_iata with less than 2 characters', () => {
      const query = { dep_iata: 'G' };
      const { error } = flightsQuerySchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/length must be at least 2/);
   });

   it('should accept dep_iata with 2 or more characters', () => {
      const query = { dep_iata: 'GU' };
      const { error } = flightsQuerySchema.validate(query);
      expect(error).toBeUndefined();
   });
});
