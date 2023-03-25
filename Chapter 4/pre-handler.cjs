const Fastify = require('fastify')

const app = Fastify({ logger: true })
app.addHook('preHandler', async (request, reply) => {
  request.body = { ...request.body, prehandler: 'added' }
  request.query = { ...request.query, prehandler: 'added' }
})
app.post('/', (request, _reply) => {
  request.log.info({ body: request.body })
  request.log.info({ query: request.query })
  return 'done'
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
