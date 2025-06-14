export interface FlightQueryParams {
   flight_date?: string;
   flight_status?: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'incident' | 'diverted';
   dep_iata?: string;
   arr_iata?: string;
   dep_icao?: string;
   arr_icao?: string;
   airline_name?: string;
   airline_iata?: string;
   airline_icao?: string;
   flight_number?: string;
   flight_iata?: string;
   flight_icao?: string;
   min_delay_dep?: string;
   min_delay_arr?: string;
   max_delay_dep?: string;
   max_delay_arr?: string;
   arr_scheduled_time_arr?: string;
   arr_scheduled_time_dep?: string;
   limit?: string;
   offset?: string;
}
