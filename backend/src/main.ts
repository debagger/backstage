import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenTelemetryLogger } from './ot-enabled.logger';
import { initTracing } from './tracing';
import { trace } from '@opentelemetry/api';

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

    await app.init();

    return app;
  });

  appCreateSpan.end();

  await app.listen(env.PORT);
}

bootstrap();
