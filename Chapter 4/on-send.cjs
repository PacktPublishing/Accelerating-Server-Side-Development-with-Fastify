const Fastify = require('fastify')

const app = Fastify({ logger: true })
app.addHook('onSend', async (request, reply, payload) => {
  const newPayload = payload.replace('foo', 'onSend')
  return newPayload
})
app.get('/', (request, _reply) => {
  return { foo: 'bar' }
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
