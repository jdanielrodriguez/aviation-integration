export interface FlightJson {
   number?: string;
   iata?: string;
   icao?: string;
   codeshared?: any;
}

export interface AirportJson {
   airport?: string;
   timezone?: string;
   iata?: string;
   icao?: string;
   terminal?: string;
   gate?: string;
   baggage?: string;
   delay?: number;
   scheduled?: string;
   estimated?: string;
   actual?: string;
   estimated_runway?: string;
   actual_runway?: string;
}

export interface AirlineJson {
   name?: string;
   iata?: string;
   icao?: string;
}

export interface AircraftJson {
   registration?: string;
   iata?: string;
   icao?: string;
   icao24?: string;
}

export interface LiveJson {
   updated?: string;
   latitude?: number;
   longitude?: number;
   altitude?: number;
   direction?: number;
   speed_horizontal?: number;
   speed_vertical?: number;
   is_ground?: boolean;
}

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
   limit?: string | number;
   offset?: string | number;
   callback?: string;
   access_key?: string;
}
