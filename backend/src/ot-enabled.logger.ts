import { Logger } from '@nestjs/common';
import * as opentelemetry from '@opentelemetry/api';
import { EOVERFLOW } from 'constants';

export class OpenTelemetryLogger extends Logger {
  constructor(private tracer: opentelemetry.Tracer) {
    super();
  }
  private addEvent(type: string, attributes: opentelemetry.Attributes) {
    const currentSpan = this.tracer.getCurrentSpan();
    if (currentSpan) {
      currentSpan.addEvent(type, attributes);
    }
  }

  error(message: string, trace: string, context: string) {
    this.addEvent('error', { message, trace, context });
    super.error(message, trace);
  }

  log(message: string, context?: string) {
    this.addEvent('log', { message, context });
    super.log(message, context);
  }

  warn(message: string, context?: string) {
    this.addEvent('warn', { message, context });
    super.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.addEvent('debug', { message, context });
    super.debug(message, context);
  }
  
  verbose(message: string, context?: string) {
    this.addEvent('verbose', { message, context });
    super.verbose(message, context);
  }
}
