import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenTelemetryLogger } from './ot-enabled.logger';
import { initTracing } from './tracing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new OpenTelemetryLogger(),
  });
  await app.listen(3000);
}

initTracing();

bootstrap();
