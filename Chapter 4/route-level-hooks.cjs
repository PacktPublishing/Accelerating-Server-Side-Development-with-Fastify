const Fastify = require('fastify')

const app = Fastify({ logger: true })

app.route({
  method: 'GET',
  url: '/',
  onRequest: async (request, reply) => {
    request.log.info('onRequest hook')
  },
  onResponse: async (request, reply) => {
    request.log.info('onResponse hook')
  },
  preParsing: async (request, reply) => {
    request.log.info('preParsing hook')
  },
  preValidation: async (request, reply) => {
    request.log.info('preValidation hook')
  },
  preHandler: async (request, reply) => {
    request.log.info('preHandler hook')
  },
  preSerialization: async (request, reply, payload) => {
    request.log.info('preSerialization hook')
    return payload
  },
  onSend: [async (request, reply, payload) => {
    request.log.info('onSend hook 1')
    return payload
  }, async (request, reply, payload) => {
    request.log.info('onSend hook 2')
    return payload
  }], // [1]
  onError: async (request, reply, error) => {},
  onTimeout: async (request, reply) => {},
  handler: function (request, reply) {
    reply.send({ foo: 'bar' })
  }
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
