import { LogLevel } from '@opentelemetry/core';
import { NodeTracerProvider } from '@opentelemetry/node';

import { BatchSpanProcessor } from '@opentelemetry/tracing';

import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
export function initTracing() {
  const provider: NodeTracerProvider = new NodeTracerProvider({
    logLevel: LogLevel.INFO,
    plugins: {
      express: {
        enabled: true,
        // You may use a package name or absolute path to the file.
        path: '@opentelemetry/plugin-express',
      },
    },
  });

  provider.register();

  provider.addSpanProcessor(
    new BatchSpanProcessor(
    //   new ZipkinExporter({
        // For Jaeger, use the following line instead:
        new JaegerExporter(
          {
        host: 'jaeger',
        port: 6832,
        serviceName: 'backstage',
        // If you are running your tracing backend on another host,
        // you can point to it using the `url` parameter of the
        // exporter config.
      }
      ),
    ),
  );

  console.log('tracing initialized');
}
