const Fastify = require('fastify')

const app = Fastify({ logger: true })
app.addHook('onRequest', async (request, reply) => {
  // [1]
  request.log.info('Hi from the top-level onRequest hook.')
})
app.register(async function plugin1 (instance, options) {
  instance.addHook('onRequest', async (request, reply) => {
    // [2]
    request.log.info('Hi from the child-level onRequest hook.')
  })

  instance.get('/child-level', async (_request, _reply) => {
    // [3]
    return 'child-level'
  })
})
app.get('/top-level', async (_request, _reply) => {
  // [4]
  return 'top-level'
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
