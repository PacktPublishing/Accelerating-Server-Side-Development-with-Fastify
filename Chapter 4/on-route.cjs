const Fastify = require('fastify')
const app = Fastify({ logger: true })

app.addHook('onRoute', routeOptions => { // [1]
  async function customPreHandler (request, reply) {
    request.log.info('Hi from customPreHandler!')
  }
  app.log.info('Adding custom preHandler to the route.')
  routeOptions.preHandler = [...(routeOptions.preHandler ?? []), customPreHandler] // [2]
})
app.route({
  // [3]
  url: '/foo',
  method: 'GET',
  schema: {
    200: {
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        }
      }
    }
  },
  handler: (req, reply) => {
    reply.send({ foo: 'bar' })
  }
})

app
  .listen({ port: 3000 })
  .then(() => {
    app.log.info('Application is listening.')
  })
  .catch(err => {
    app.log.error(err)
    process.exit()
  })
