import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Context
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomingMessage } from 'http';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { Ping } from './ping.entity';
import { Pings } from './pings.model';

@Resolver((of) => Ping)
export class PingResolver {
  constructor(
    @InjectRepository(Ping) private pingRepository: Repository<Ping>,
    private service: AppService,
  ) {}
  @Query((returns) => Pings)
  async pings(
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ) {
    console.log('ping query');
    const res = new Pings();
    res.pings = await this.pingRepository.find({
      skip,
      take,
      order: { id: 'ASC' },
    });
    res.count = await this.pingRepository.count();
    return res;
  }
  @Mutation(returns=>Int)
  async ping(@Context() context:{req:IncomingMessage}) {
    const headers = context.req.headers
   return await this.service.ping(headers);

  }
}
