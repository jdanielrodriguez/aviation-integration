import { Request, Response, NextFunction } from 'express';
const { getFlightsController } = require('../../../controllers/flightController');
const flightService = require('../../../services/flightQueryService');
const { syncFlightsIfNeeded, logApiCall } = require('../../../services/aviationStackService');

jest.mock('../../../services/flightQueryService');
jest.mock('../../../services/aviationStackService');

describe('flightController', () => {
   const req = {
      query: { dep_iata: 'GUA' }
   } as unknown as Request;

   const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
   } as unknown as Response;

   const next = jest.fn() as NextFunction;

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('debe retornar los vuelos correctamente', async () => {
      const mockData = {
         pagination: { total: 1, count: 1, limit: 20, offset: 0 },
         data: [{ flight_number: '123', dep_iata: 'GUA' }]
      };

      flightService.getFlightsFromDb.mockResolvedValue(mockData);
      syncFlightsIfNeeded.mockResolvedValue(undefined);
      logApiCall.mockResolvedValue(undefined);

      await getFlightsController(req, res, next);

      expect(res.json).toHaveBeenCalledWith(mockData);
   });

   it('debe manejar errores correctamente', async () => {
      const error = new Error('fail');

      flightService.getFlightsFromDb.mockRejectedValue(error);
      syncFlightsIfNeeded.mockResolvedValue(undefined);
      logApiCall.mockResolvedValue(undefined);

      await getFlightsController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
   });
});
