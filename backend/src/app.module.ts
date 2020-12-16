import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ping } from './ping.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'backend',
      entities: [Ping],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Ping])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
