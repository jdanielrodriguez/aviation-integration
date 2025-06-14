import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('api_calls')
export class ApiCall {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column()
   endpoint!: string;

   @Column('json')
   parameters: any;

   @Column('json')
   response: any;

   @Column()
   status_code!: number;

   @Column({ type: 'datetime' })
   timestamp!: Date;

}
