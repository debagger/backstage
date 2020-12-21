import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ping } from './ping.entity';
import * as dotenv from 'dotenv';

dotenv.config({ debug: true });
const env = process.env



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: Number(env.POSTGRES_PORT),
      username: env.POSTGRES_USERNAME,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DATABASE,
      entities: [Ping],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Ping]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
  }
}
