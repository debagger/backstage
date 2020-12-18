import { Logger } from '@nestjs/common';
import * as opentelemetry from '@opentelemetry/api';

export class OpenTelemetryLogger extends Logger {
  private tracer = opentelemetry.trace.getTracer('nuxt-error-tracer');
  error(message: string, trace: string) {
    try {
      const span = this.tracer.getCurrentSpan();
      if (span) {
        span.setAttribute('error_message', message);
        span.setAttribute('error_trace', trace);
      }
    } catch (error) {}
    super.error(message, trace);
  }

  log(message: string, context?: string) {
    try {
      const span = this.tracer.startSpan('log_message');
      span.setAttribute('message', message);
      span.setAttribute('context', context);
      span.end()
    } catch (error) {}
    super.log('message', context);
  }
}
