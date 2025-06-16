import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'airlines' })
export class Airline {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column()
   airline_name!: string;

   @Column({ nullable: true, unique: true })
   iata_code!: string;

   @Column({ nullable: true })
   icao_code!: string;

   @Column({ nullable: true })
   callsign!: string;

   @Column({ nullable: true })
   type!: string;

   @Column({ nullable: true })
   status!: string;

   @Column({ nullable: true })
   fleet_size!: string;

   @Column({ nullable: true })
   fleet_average_age!: string;

   @Column({ nullable: true })
   date_founded!: string;

   @Column({ nullable: true })
   hub_code!: string;

   @Column({ nullable: true })
   iata_prefix_accounting!: string;

   @Column({ nullable: true })
   country_name!: string;

   @Column({ nullable: true })
   country_iso2!: string;
}
