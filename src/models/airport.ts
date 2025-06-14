import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'airports' })
export class Airport {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column()
   airport_name!: string;

   @Column()
   iata_code!: string;

   @Column()
   icao_code!: string;

   @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
   latitude!: number;

   @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
   longitude!: number;

   @Column({ nullable: true })
   timezone!: string;

   @Column({ nullable: true })
   gmt!: string;

   @Column({ nullable: true })
   country_name!: string;

   @Column({ nullable: true })
   country_iso2!: string;

   @Column({ nullable: true })
   city_iata_code!: string;
}
