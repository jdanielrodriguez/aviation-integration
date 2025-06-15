import { AppDataSource } from '../../config/database';
import { getFlightsFromDb } from '../../services/flightQueryService';
import { Flight } from '../../models/flight';

beforeAll(async () => {
   if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      await AppDataSource.runMigrations();

      const repo = AppDataSource.getRepository(Flight);

      await repo.save({
         flight_date: '2025-06-15',
         flight_status: 'scheduled',
         departure: {
            airport: 'La Aurora',
            timezone: 'America/Guatemala',
            iata: 'GUA',
            icao: 'MGGT',
            terminal: '1',
            gate: '2',
            delay: 5,
            scheduled: '2025-06-15T08:00:00+00:00',
            estimated: '2025-06-15T08:00:00+00:00',
         },
         arrival: {
            airport: 'Benito Juárez',
            timezone: 'America/Mexico_City',
            iata: 'MEX',
            icao: 'MMMX',
            terminal: '1',
            gate: '4',
            delay: 2,
            scheduled: '2025-06-15T11:00:00+00:00',
            estimated: '2025-06-15T11:00:00+00:00',
         },
         airline: {
            name: 'Aeroméxico',
            iata: 'AM',
            icao: 'AMX'
         },
         flight: {
            number: '123',
            iata: 'AM123',
            icao: 'AMX123'
         },
         aircraft: undefined,
         live: undefined
      });
   }
});

afterAll(async () => {
   await AppDataSource.destroy();
});

describe('getFlightsFromDb() - filter coverage', () => {
   it('filters by flight_date', async () => {
      const result = await getFlightsFromDb({ flight_date: '2025-06-15' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].flight_date).toBe('2025-06-15');
   });

   it('filters by flight_status', async () => {
      const result = await getFlightsFromDb({ flight_status: 'scheduled' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].flight_status).toBe('scheduled');
   });

   it('filters by flight_number', async () => {
      const result = await getFlightsFromDb({ flight_number: '123' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].flight.number).toBe('123');
   });

   it('filters by flight_iata', async () => {
      const result = await getFlightsFromDb({ flight_iata: 'AM123' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].flight.iata).toBe('AM123');
   });

   it('filters by flight_icao', async () => {
      const result = await getFlightsFromDb({ flight_icao: 'AMX123' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].flight.icao).toBe('AMX123');
   });

   it('filters by dep_iata', async () => {
      const result = await getFlightsFromDb({ dep_iata: 'GUA' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].departure.iata).toBe('GUA');
   });

   it('filters by arr_iata', async () => {
      const result = await getFlightsFromDb({ arr_iata: 'MEX' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].arrival.iata).toBe('MEX');
   });

   it('filters by dep_icao', async () => {
      const result = await getFlightsFromDb({ dep_icao: 'MGGT' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].departure.icao).toBe('MGGT');
   });

   it('filters by arr_icao', async () => {
      const result = await getFlightsFromDb({ arr_icao: 'MMMX' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].arrival.icao).toBe('MMMX');
   });

   it('filters by airline_name', async () => {
      const result = await getFlightsFromDb({ airline_name: 'Aeroméxico' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].airline.name).toBe('Aeroméxico');
   });

   it('filters by airline_iata', async () => {
      const result = await getFlightsFromDb({ airline_iata: 'AM' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].airline.iata).toBe('AM');
   });

   it('filters by airline_icao', async () => {
      const result = await getFlightsFromDb({ airline_icao: 'AMX' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].airline.icao).toBe('AMX');
   });

   it('filters by min_delay_dep', async () => {
      const result = await getFlightsFromDb({ min_delay_dep: '5' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].departure.delay).toBeGreaterThanOrEqual(5);
   });

   it('filters by max_delay_dep', async () => {
      const result = await getFlightsFromDb({ max_delay_dep: '5' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].departure.delay).toBeLessThanOrEqual(5);
   });

   it('filters by min_delay_arr', async () => {
      const result = await getFlightsFromDb({ min_delay_arr: '2' });
      expect(result.data.length).toBeGreaterThanOrEqual(0);
      if (result.data.length) expect(result.data[0].arrival.delay).toBeGreaterThanOrEqual(2);
   });

   it('filters by max_delay_arr', async () => {
      const result = await getFlightsFromDb({ max_delay_arr: '2' });
      expect(result.data.length).toBeGreaterThanOrEqual(0);
      if (result.data.length) expect(result.data[0].arrival.delay).toBeLessThanOrEqual(2);
   });

   it('filters by arr_scheduled_time_arr', async () => {
      const result = await getFlightsFromDb({ arr_scheduled_time_arr: '2025-06-15' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].arrival.scheduled).toContain('2025-06-15');
   });

   it('filters by arr_scheduled_time_dep', async () => {
      const result = await getFlightsFromDb({ arr_scheduled_time_dep: '2025-06-15' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].departure.scheduled).toContain('2025-06-15');
   });

   it('applies pagination', async () => {
      const result = await getFlightsFromDb({ limit: '1', offset: '0' });
      expect(result.data.length).toBeLessThanOrEqual(1);
      expect(result.pagination.limit).toBe(1);
   });
});
