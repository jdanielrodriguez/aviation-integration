import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Flight {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column()
   flight_number!: string;
}
