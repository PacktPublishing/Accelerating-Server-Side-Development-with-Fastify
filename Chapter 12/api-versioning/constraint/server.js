const fastify = require('fastify')()

async function getAllPosts () {
  // Call a database or something
  return [{
    id: 1,
    title: 'Hello World'
  }]
}

fastify.get('/posts', {
  constraints: {
    version: '1.0.0'
  }
}, (request, reply) => {
  return getAllPosts()
})

fastify.get('/posts', {
  constraints: {
    version: '2.0.0'
  }
}, async (request, reply) => {
  return {
    posts: await getAllPosts()
  }
})

fastify.listen({ port: 3000 })
