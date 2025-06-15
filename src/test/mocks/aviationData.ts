export const MOCK_FLIGHTS = [
   {
      flight_date: '2025-06-14',
      flight_status: 'active',
      flight: { number: '123', iata: 'AA123' },
      departure: { iata: 'GUA' },
      arrival: { iata: 'MIA' },
      airline: { name: 'American Airlines' }
   }
];

export const MOCK_AIRPORTS = [
   {
      airport_name: 'Quetzaltenango',
      iata_code: 'AAZ',
      icao_code: 'MGQZ',
      latitude: 14.87,
      longitude: -91.5,
      timezone: 'America/Guatemala',
      gmt: '-6',
      country_name: 'Guatemala',
      country_iso2: 'GT',
      city_iata_code: 'AAZ'
   }
];
