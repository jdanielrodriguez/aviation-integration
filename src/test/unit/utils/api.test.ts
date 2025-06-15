import { required } from '../../../config/api';

describe('required()', () => {
   it('lanza error si la variable no existe', () => {
      delete process.env.NO_EXISTE_VAR;
      expect(() => required('NO_EXISTE_VAR')).toThrow(/NO_EXISTE_VAR/);
   });
   it('devuelve el valor si la variable existe', () => {
      process.env.SI_EXISTE_VAR = 'x';
      expect(required('SI_EXISTE_VAR')).toBe('x');
   });
});
