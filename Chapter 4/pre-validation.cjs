const Fastify = require('fastify')

const app = Fastify({ logger: true })
app.addHook('preValidation', async (request, _reply) => {
  request.body = { ...request.body, preValidation: 'added' }
})
app.post('/', (request, _reply) => {
  request.log.info(request.body)
  return 'done'
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
