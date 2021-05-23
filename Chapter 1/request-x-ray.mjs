import fastify from 'fastify'

const serverOptions = {
  logger: {
    level: 'debug',
    prettyPrint: true
  }
}
const app = fastify(serverOptions)

app.get('/xray', function xRay(request, reply) {
  // send back all the request properties
  reply.send({
    id: request.id, // [1] id assigned to the request in req-<progress>
    ip: request.ip, // the client ip address
    ips: request.ips, // [2] the client ip addressed
    hostname: request.hostname, // the client hostname
    protocol: request.protocol, // the request protocol
    method: request.method, // the request HTTP method
    url: request.url, // the request URL
    routerPath: request.routerPath, // [3] the generic handler URL
    is404: request.is404 // [4] the request has been routed or not
  })
})

// *** //

app.get('/log', function log(request, reply) {
  request.log.info('hello') // [1]
  request.log.info('world')
  reply.log.info('late to the party') // same as request.log

  app.log.info('unrelated') // [2]
  reply.send()
})

// *** //

await app.listen({
  port: 8080,
  host: '0.0.0.0'
})
