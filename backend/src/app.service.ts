import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ping } from './ping.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Ping) private pingRepository: Repository<Ping>,
  ) {}
  getHello(): string {
    return 'Hello World!!!';
  }
  async ping(): Promise<number> {
    const newPing = new Ping();
    newPing.date = new Date();
    await this.pingRepository.insert(newPing);
    return newPing.id;
  }
}
