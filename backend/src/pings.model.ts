import { Field, ObjectType } from "@nestjs/graphql";
import { Ping } from "./ping.entity";

@ObjectType()
export class Pings {
    @Field(type=>[Ping])
    pings:Ping[]
    
    @Field()
    count:number
}