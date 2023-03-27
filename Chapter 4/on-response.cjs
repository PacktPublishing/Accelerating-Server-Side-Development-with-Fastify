const Fastify = require('fastify')

const app = Fastify({ logger: true })
app.addHook('onResponse', async (request, reply) => {
  request.log.info('onResponse hook') // [1]
})
app.get('/', (request, _reply) => {
  return { foo: 'bar' }
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
