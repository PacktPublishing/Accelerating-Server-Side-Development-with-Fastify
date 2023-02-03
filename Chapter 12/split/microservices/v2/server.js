const crypto = require('crypto')

const fastify = require('fastify')({
  logger: true,
  genReqId (req) {
    return req.headers['x-request-id'] || crypto.randomUUID()
  }
})

fastify.register(require('@fastify/autoload'), {
  dir: `${__dirname}/services`
})

fastify.register(require('@fastify/autoload'), {
  dir: `${__dirname}/routes`
})

fastify.listen({ port: 3002, host: '0.0.0.0' })
