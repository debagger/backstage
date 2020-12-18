import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({type:'jsonb', nullable:true})
  headers:Object
}