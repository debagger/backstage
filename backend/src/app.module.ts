import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ping } from './ping.entity';
import { GraphQLModule } from '@nestjs/graphql';
import * as dotenv from 'dotenv';
import * as jwksRsa from 'jwks-rsa';
import * as jwt from 'express-jwt';
import { join } from 'path';
import { PingResolver } from './ping.resolver';
import { AuthModule } from './auth/auth.module';
import { env } from 'process';

dotenv.config({ debug: true });

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
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PingResolver],
})
export class AppModule implements OnModuleInit, NestModule {
  configure(consumer: MiddlewareConsumer) {
    // const checkJwt = jwt({
    //   // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
    //   secret: jwksRsa.expressJwtSecret({
    //     cache: true,
    //     rateLimit: true,
    //     jwksRequestsPerMinute: 5,
    //     jwksUri: `${env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
    //   }),

    //   // Validate the audience and the issuer
    //   audience: env.AUTH0_AUDIENCE, //replace with your API's audience, available at Dashboard > APIs
    //   issuer: env.AUTH0_ISSUER_URL,
    //   algorithms: ['RS256'],
    // });
    // consumer.apply(checkJwt).exclude('graphql').forRoutes('*');
  }
  onModuleInit() {}
}
