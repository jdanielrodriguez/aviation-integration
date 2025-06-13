import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Airport {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column()
   name!: string;

   @Column()
   iata_code!: string;

}
