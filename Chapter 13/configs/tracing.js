'use strict'

const packageJson = require('../package.json')
// [1]
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { Resource } = require('@opentelemetry/resources')
const { ParentBasedSampler, TraceIdRatioBasedSampler } = require('@opentelemetry/sdk-trace-base')
// [2]
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const { DnsInstrumentation } = require('@opentelemetry/instrumentation-dns')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { FastifyInstrumentation } = require('@opentelemetry/instrumentation-fastify')
const { MongoDBInstrumentation } = require('@opentelemetry/instrumentation-mongodb')
// [3]
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base')
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin')

const sdk = new NodeTracerProvider({
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(1)
  }),
  resource: new Resource({
    // https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/opentelemetry-semantic-conventions/src/resource/SemanticResourceAttributes.ts
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
    [SemanticResourceAttributes.SERVICE_NAME]: packageJson.name,
    [SemanticResourceAttributes.SERVICE_VERSION]: packageJson.version
  })
})

registerInstrumentations({
  tracerProvider: sdk,
  instrumentations: [
    new DnsInstrumentation(),
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
    new MongoDBInstrumentation()
  ]
})

const exporter = new ZipkinExporter({
  url: 'http://localhost:9411/api/v2/spans'
})
sdk.addSpanProcessor(new BatchSpanProcessor(exporter))
sdk.register({})
console.log('OpenTelemetry SDK started')
