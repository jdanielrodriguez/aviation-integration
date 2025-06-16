import { requestLogger } from '../../../middleware/requestLogger';
import logger from '../../../config/logger';

jest.mock('../../../config/logger', () => ({
   info: jest.fn(),
}));

describe('requestLogger middleware', () => {
   it('should record query and status', () => {
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

   it('should log when request has a body', () => {
      const req: any = {
         method: 'POST',
         originalUrl: '/api/test-body',
         query: {},
         body: { foo: 'bar' }
      };

      const res: any = {
         statusCode: 201,
         on: jest.fn((event, cb) => {
            if (event === 'finish') cb();
         })
      };

      const next = jest.fn();

      requestLogger(req, res, next);

      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('[POST] /api/test-body - Body: {"foo":"bar"}'));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Status: 201'));
      expect(next).toHaveBeenCalled();
   });

   it('should log when request has both body and query', () => {
      const req: any = {
         method: 'PUT',
         originalUrl: '/api/test-both',
         query: { x: 'y' },
         body: { foo: 'bar' }
      };

      const res: any = {
         statusCode: 202,
         on: jest.fn((event, cb) => {
            if (event === 'finish') cb();
         })
      };

      const next = jest.fn();

      requestLogger(req, res, next);

      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('[PUT] /api/test-both - Body: {"foo":"bar"} Query: {"x":"y"}'));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Status: 202'));
      expect(next).toHaveBeenCalled();
   });
});
