import { required } from '../../../config/api';

describe('required()', () => {
   it('throws an error if the variable does not exist', () => {
      delete process.env.NO_EXISTE_VAR;
      expect(() => required('NO_EXISTE_VAR')).toThrow(/NO_EXISTE_VAR/);
   });
   it('returns the value if the variable exists', () => {
      process.env.SI_EXISTE_VAR = 'x';
      expect(required('SI_EXISTE_VAR')).toBe('x');
   });
});
