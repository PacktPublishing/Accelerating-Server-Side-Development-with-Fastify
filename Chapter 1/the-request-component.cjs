'use strict'
const fastify = require('fastify')

const app = fastify({
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty'
    }
  },
  disableRequestLogging: true,
  requestIdLogLabel: 'reqId',
  requestIdHeader: 'request-id',
  genReqId: function (httpIncomingMessage) {
    return `foo-${Math.random()}`
  }
})

app.get('/xray', function xRay (request, reply) {
  // send back all the request properties
  return {
    id: request.id, // id assigned to the request in req-<progress>
    ip: request.ip, // the client ip address
    ips: request.ips, // proxy ip addressed
    hostname: request.hostname, // the client hostname
    protocol: request.protocol, // the request protocol
    method: request.method, // the request HTTP method
    url: request.url, // the request URL
    routerPath: request.routerPath, // the generic handler URL
    is404: request.is404 // the request has been routed or not
  }
})

app.get('/log', function log (request, reply) {
  request.log.info('hello') // [1]
  request.log.info('world')
  reply.log.info('late to the party') // same as request.log

  app.log.info('unrelated') // [2]
  reply.send()
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Server is now listening on ${address}
  })
