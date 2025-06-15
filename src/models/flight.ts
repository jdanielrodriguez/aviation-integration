import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AirportJson, AirlineJson, AircraftJson, FlightJson, LiveJson } from '../types/flight';

@Entity({ name: 'flights' })
export class Flight {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column()
   flight_date!: string;

   @Column()
   flight_status!: string;

   @Column('json')
   departure!: AirportJson;

   @Column('json')
   arrival!: AirportJson;

   @Column('json')
   airline!: AirlineJson;

   @Column('json')
   flight!: FlightJson;

   @Column('json', { nullable: true })
   aircraft!: AircraftJson;

   @Column('json', { nullable: true })
   live!: LiveJson;
}
