const crypto = require('crypto')
const fastify = require('fastify')({
  logger: true,
  genReqId (req) {
    const uuid = crypto.randomUUID()
    req.headers['x-request-id'] = uuid
    return uuid
  }
})

fastify.register(require('@fastify/http-proxy'), {
  prefix: '/v1',
  upstream: process.env.V1_URL || 'http://127.0.0.1:3001'
})

fastify.register(require('@fastify/http-proxy'), {
  prefix: '/v2',
  upstream: process.env.V2_URL || 'http://127.0.0.1:3002'
})

fastify.listen({ port: 3000, host: '0.0.0.0' })
