import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {GraphQLJSONObject} from 'graphql-type-json';

@Entity()
@ObjectType()
export class Ping {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  date: Date;

  
  @Column({ type: 'jsonb', nullable: true })
  @Field(type=> GraphQLJSONObject)
  headers: Object;
}
