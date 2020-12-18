import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ping } from './ping.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Ping) private pingRepository: Repository<Ping>,
  ) {}

  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!!!';
  }
  async ping(headers:Headers): Promise<number> {
    this.logger.log("Ping ping!!!!!!!!!!!!!!!!!!!!!")
    const newPing = new Ping();
    newPing.date = new Date();
    newPing.headers = headers;
    await this.pingRepository.insert(newPing);
    return newPing.id;
  }

  async pingCount(){
    return await this.pingRepository.count()
  }
}
