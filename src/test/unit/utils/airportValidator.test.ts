import { schema as airportQuerySchema } from '../../../utils/airportValidator';

describe('airportValidator', () => {
   it('debe aceptar un query válido', () => {
      const query = { search: 'guatemala', limit: 10, offset: 0 };
      const { error } = airportQuerySchema.validate(query);
      expect(error).toBeUndefined();
   });

   it('debe rechazar search muy corto', () => {
      const query = { search: 'a' };
      const { error } = airportQuerySchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/length must be at least 2/);
   });

   it('debe rechazar limit si es negativo o cero', () => {
      const query = { limit: 0 };
      const { error } = airportQuerySchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/must be greater than or equal to 1/);
   });

   it('debe rechazar offset negativo', () => {
      const query = { offset: -5 };
      const { error } = airportQuerySchema.validate(query);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/must be greater than or equal to 0/);
   });
});
