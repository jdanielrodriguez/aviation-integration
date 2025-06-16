import { errorHandler } from '../../../middleware/errorHandler';
import { Request } from 'express';

jest.mock('../../../config/logger', () => ({
   error: jest.fn(),
}));

describe('errorHandler middleware', () => {
   let oldEnv: any;

   beforeAll(() => {
      oldEnv = { ...process.env };
   });
   afterAll(() => {
      process.env = oldEnv;
   });

   it('should return a structured error and log the error (default 500)', () => {
      const req = {} as Request;
      const res = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
      } as any;
      const error = new Error('Test error');

      errorHandler(error, req, res, () => { });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
         error: expect.objectContaining({ message: 'Test error' })
      }));
   });

   it('should use status from err.status if valid', () => {
      const req = {} as Request;
      const res = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
      } as any;
      const error: any = new Error('Not found');
      error.status = 404;

      errorHandler(error, req, res, () => { });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
         error: expect.objectContaining({ message: 'Not found', status: 404 })
      }));
   });

   it('should fallback to 500 if err.status is invalid', () => {
      const req = {} as Request;
      const res = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
      } as any;
      const error: any = new Error('Invalid status');
      error.status = 'not-a-number';

      errorHandler(error, req, res, () => { });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
         error: expect.objectContaining({ message: 'Invalid status', status: 500 })
      }));
   });

   it('should return "Internal Server Error" if err.message is falsy', () => {
      const req = {} as Request;
      const res = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
      } as any;
      const error: any = {};
      error.status = 503;
      error.message = '';

      errorHandler(error, req, res, () => { });

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
         error: expect.objectContaining({ message: 'Internal Server Error', status: 503 })
      }));
   });

   it('should include stack in non-production', () => {
      process.env.NODE_ENV = 'development';
      const req = {} as Request;
      const res = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
      } as any;
      const error: any = new Error('Test error');
      error.status = 400;

      errorHandler(error, req, res, () => { });

      expect(res.json.mock.calls[0][0].error.stack).toBeDefined();
   });

   it('should omit stack in production', () => {
      process.env.NODE_ENV = 'production';
      const req = {} as Request;
      const res = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
      } as any;
      const error: any = new Error('Test error');
      error.status = 400;

      errorHandler(error, req, res, () => { });

      expect(res.json.mock.calls[0][0].error.stack).toBeUndefined();
   });
});
