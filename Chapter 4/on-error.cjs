const Fastify = require('fastify')

const app = Fastify({ logger: true })
app.addHook('onError', async (request, _reply, error) => { // [1]
  request.log.info(`Hi from onError hook: ${error.message}`)
})
app.get('/foo', async (_request, _reply) => {
  return new Error('foo') // [2]
})
app.get('/bar', async (_request, _reply) => {
  throw new Error('bar') // [3]
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
