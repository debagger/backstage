import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;
}