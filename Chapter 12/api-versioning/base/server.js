const fastify = require('fastify')()

fastify.get('/posts', async (request, reply) => {
  return [{
    id: 1,
    title: 'Hello World'
  }]
})

fastify.listen({ port: 3000 })
