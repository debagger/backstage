import { LogLevel } from '@opentelemetry/core';
import { NodeTracerProvider } from '@opentelemetry/node';

import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
// For Jaeger, use the following line instead:
// import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
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
    new SimpleSpanProcessor(
      new ZipkinExporter({
        // For Jaeger, use the following line instead:
        // new JaegerExporter({
        url: 'http://zipkin:9411/api/v2/spans',
        serviceName: 'backstage',
        // If you are running your tracing backend on another host,
        // you can point to it using the `url` parameter of the
        // exporter config.
      }),
    ),
  );

  console.log('tracing initialized');
}
