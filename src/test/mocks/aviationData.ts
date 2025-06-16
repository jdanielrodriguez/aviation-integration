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

export const MOCK_AIRLINES = [
   {
      airline_name: "Mock Airline",
      iata_code: "MA",
      icao_code: "MCK",
      callsign: "MOCKAIR",
      type: "scheduled",
      status: "active",
      fleet_size: "10",
      fleet_average_age: "5",
      date_founded: "2020",
      hub_code: "MCK",
      iata_prefix_accounting: "999",
      country_name: "Mockland",
      country_iso2: "MK"
   }
];
