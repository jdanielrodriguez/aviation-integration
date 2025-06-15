import { errorHandler } from '../../../middleware/errorHandler';
import { Request } from 'express';
import logger from '../../../config/logger';

jest.mock('../../../config/logger', () => ({
   error: jest.fn(),
}));

describe('errorHandler middleware', () => {
   it('should return a structured error and log the error', () => {
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

      const calls = (logger.error as jest.Mock).mock.calls;
      expect(calls[0].some((arg: { message: string; }) => arg instanceof Error && arg.message === 'Test error')).toBe(true);

   });
});
