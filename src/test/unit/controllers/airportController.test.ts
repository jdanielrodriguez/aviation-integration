import { Request, Response, NextFunction } from 'express';
import { getAirportsController } from '../../../controllers/airportController';
const { getAirportsFromDb } = require('../../../services/airportQueryService');
const { syncAirportsIfNeeded, logApiCall } = require('../../../services/aviationStackService');

jest.mock('../../../services/airportQueryService', () => ({
   getAirportsFromDb: jest.fn()
}));
jest.mock('../../../services/aviationStackService', () => ({
   syncAirportsIfNeeded: jest.fn(),
   logApiCall: jest.fn()
}));

describe('airportController', () => {
   const req = {
      query: { search: 'guatemala' }
   } as unknown as Request;

   const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
   } as unknown as Response;

   const next = jest.fn() as NextFunction;

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('should return airports successfully', async () => {
      const mockData = { pagination: { total: 1 }, data: [{ iata_code: 'GUA' }] };
      getAirportsFromDb.mockResolvedValue(mockData);
      syncAirportsIfNeeded.mockResolvedValue(undefined);
      logApiCall.mockResolvedValue(undefined);

      await getAirportsController(req, res, next);

      expect(syncAirportsIfNeeded).toHaveBeenCalled();
      expect(getAirportsFromDb).toHaveBeenCalledWith(req.query);
      expect(logApiCall).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockData);
   });

   it('should handle errors properly', async () => {
      const error = new Error('fail');
      getAirportsFromDb.mockRejectedValue(error);
      syncAirportsIfNeeded.mockResolvedValue(undefined);
      logApiCall.mockResolvedValue(undefined);

      await getAirportsController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
   });
});
