import { Request, Response, NextFunction } from 'express';
const { getAirlinesController } = require('../../../controllers/airlineController');
const airlineService = require('../../../services/airlineQueryService');
const { syncAirlinesIfNeeded, logApiCall } = require('../../../services/aviationStackService');

jest.mock('../../../services/airlineQueryService');
jest.mock('../../../services/aviationStackService');

describe('airlineController', () => {
   const req = {
      query: { search: 'mock' }
   } as unknown as Request;

   const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
   } as unknown as Response;

   const next = jest.fn() as NextFunction;

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('should return airlines correctly', async () => {
      const mockData = { pagination: { total: 1 }, data: [{ iata_code: 'MA' }] };
      airlineService.getAirlinesFromDb.mockResolvedValue(mockData);
      syncAirlinesIfNeeded.mockResolvedValue(undefined);
      logApiCall.mockResolvedValue(undefined);

      await getAirlinesController(req, res, next);

      expect(syncAirlinesIfNeeded).toHaveBeenCalled();
      expect(airlineService.getAirlinesFromDb).toHaveBeenCalledWith(req.query);
      expect(logApiCall).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockData);
   });

   it('should handle errors correctly', async () => {
      const error = new Error('fail');
      airlineService.getAirlinesFromDb.mockRejectedValue(error);
      syncAirlinesIfNeeded.mockResolvedValue(undefined);
      logApiCall.mockResolvedValue(undefined);

      await getAirlinesController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
   });
});
