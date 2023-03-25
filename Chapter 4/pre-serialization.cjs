const Fastify = require('fastify')

const app = Fastify({ logger: true })
app.addHook('preSerialization', async (request, reply, payload) => {
  return { ...payload, preSerialization: 'added' }
})
app.get('/', (request, _reply) => {
  return { foo: 'bar' }
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
