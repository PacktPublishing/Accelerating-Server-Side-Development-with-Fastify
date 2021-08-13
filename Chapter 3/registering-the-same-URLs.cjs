'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

// Version constraint
app.get('/user', function (request, reply) {
  reply.send({ user: 'John Doe' })
})
app.get('/user',
  {
    constraints: {
      version: '2.0.0'
    }
  },
  function handler (request, reply) {
    reply.send({ username: 'John Doe' })
  }
)

// Host constraint
app.get('/host', func0)
app.get('/host', {
  handler: func2,
  constraints: {
    host: /^bar.*/
  }
})

// Both Host and Version constraints
app.get('/together', func0)
app.get('/together', {
  handler: func1,
  constraints: {
    version: '1.0.1',
    host: 'foo.fastify.dev'
  }
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })

function func0 (request, reply) {
  reply.send({ user: 'John Doe' })
}
function func1 (request, reply) {
  reply.send({ username: 'John Doe' })
}
function func2 (request, reply) {
  reply.send({ name: 'John Doe' })
}
