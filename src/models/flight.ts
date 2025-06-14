import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'flights' })
export class Flight {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column()
   flight_date!: string;

   @Column()
   flight_status!: string;

   @Column('json')
   departure!: any;

   @Column('json')
   arrival!: any;

   @Column('json')
   airline!: any;

   @Column('json')
   flight!: any;

   @Column('json', { nullable: true })
   aircraft!: any;

   @Column('json', { nullable: true })
   live!: any;
}
