import { requestLogger } from '../../../middleware/requestLogger';
import logger from '../../../config/logger';

jest.mock('../../../config/logger', () => ({
   info: jest.fn(),
}));

describe('requestLogger middleware', () => {
   it('debería registrar query y status', () => {
      const req: any = {
         method: 'GET',
         originalUrl: '/api/test',
         query: { q: 'value' },
         body: {}
      };

      const res: any = {
         statusCode: 200,
         on: jest.fn((event, cb) => {
            if (event === 'finish') cb();
         })
      };

      const next = jest.fn();

      requestLogger(req, res, next);

      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('[GET] /api/test - Query: {"q":"value"}'));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Status: 200'));
      expect(next).toHaveBeenCalled();
   });
});
