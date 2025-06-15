import { schema as flightsQuerySchema } from '../../../utils/flightsValidator';

describe('flightsValidator', () => {
   it('debe aceptar un query válido', () => {
      const query = { dep_iata: 'GUA', arr_iata: 'JFK', flight_number: '123' };
      const { error } = flightsQuerySchema.validate(query);
      expect(error).toBeUndefined();
   });

   it('debe rechazar dep_iata con menos de 2 caracteres', () => {
      const query = { dep_iata: 'G' };
      const { error } = flightsQuerySchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/length must be at least 2/);
   });

   it('debe aceptar dep_iata de 2 o más caracteres', () => {
      const query = { dep_iata: 'GU' }; 
      const { error } = flightsQuerySchema.validate(query);
      expect(error).toBeUndefined();
   });
});
