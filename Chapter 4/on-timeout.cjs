const Fastify = require('fastify')
const { promisify } = require('util')

const wait = promisify(setTimeout)
const app = Fastify({ logger: true, connectionTimeout: 1000 }) // [1]
app.addHook('onTimeout', async (request, reply) => {
  request.log.info('The connection is closed.') // [2]
})

app.get('/', async (_request, _reply) => {
  await wait(5000) // [3]
  return ''
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
