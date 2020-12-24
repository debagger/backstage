import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ping } from './ping.entity';
import * as dotenv from 'dotenv';
import * as jwksRsa from 'jwks-rsa';
import * as jwt from 'express-jwt';

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
export class AppModule implements OnModuleInit, NestModule {
  configure(consumer: MiddlewareConsumer) {
    const checkJwt = jwt({
      // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-73xuxxwd.eu.auth0.com/.well-known/jwks.json',
      }),

      // Validate the audience and the issuer
      audience: 'http://localhost', //replace with your API's audience, available at Dashboard > APIs
      issuer: 'https://dev-73xuxxwd.eu.auth0.com/',
      algorithms: ['RS256'], 
    });
    consumer.apply(checkJwt).forRoutes('*')
  }
  onModuleInit() {
  }
}
