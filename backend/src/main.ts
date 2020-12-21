import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenTelemetryLogger } from './ot-enabled.logger';
import { initTracing } from './tracing';
import { trace } from '@opentelemetry/api';
import { auth } from 'express-openid-connect';

initTracing();

const tracer = trace.getTracer('nest-tracer');

async function bootstrap() {
  const env = process.env;

  const logger = new OpenTelemetryLogger(tracer);
  const appCreateSpan = tracer.startSpan('Create nest app', { root: true });

  const app = await tracer.withSpan(appCreateSpan, async () => {
    const app = await NestFactory.create(AppModule, {
      logger,
    });
    app.use(
      auth({
        authRequired: false,
        issuerBaseURL: env.AUTH0_ISSUER_URL,
        baseURL: env.AUTH0_BASE_URL,
        clientID: env.AUTH0_CLIENT_ID,
        clientSecret: env.AUTH0_CLIENT_SECRET,
        secret: env.AUTH0_SECRET,
        authorizationParams: {
          response_type: 'code',
          scope: 'openid profile admin:true',
          audience: env.AUTH0_SECRET,
        },
        routes: {
          login: '/auth/login',
          logout: '/auth/logout',
          callback: '/auth/callback',
        },
      }),
    );

    await app.init();

    return app;
  });

  appCreateSpan.end();

  await app.listen(env.PORT);
}

bootstrap();
