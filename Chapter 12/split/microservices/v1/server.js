const crypto = require('crypto')

const fastify = require('fastify')({
  logger: true,
  genReqId (req) {
    return req.headers['x-request-id'] || crypto.randomUUID()
  }
})

fastify.register(require('@fastify/autoload'), {
  dir: `${__dirname}/services`,
  options: {
    v2URL: process.env.V2_URL || 'http://127.0.0.1:3002'
  }
})

fastify.register(require('@fastify/autoload'), {
  dir: `${__dirname}/routes`
})

fastify.listen({ port: 3001, host: '0.0.0.0' })
