
const Fastify = require('fastify')

async function isAuthorized () {
  return false
}

const app = Fastify({ logger: true })

app.addHook('preParsing', async (request, reply) => {
  const authorized = await isAuthorized(request) // [1]
  if (!authorized) {
    reply.code(401)
    reply.send('Unauthorized') // [2]
    return reply // [3]
  }
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
