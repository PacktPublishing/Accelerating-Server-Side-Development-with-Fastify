'use strict'

const fastify = require('fastify')

const app = fastify({
  logger: true
})

app.post('/filter', {
  async handler (request, reply) {
    return {
      username: 'Foo',
      password: 'qwerty'
    }
  },
  schema: {
    respose: {
      '2xx': {
        type: 'object',
        properties: {
          username: { type: 'string' }
        }
      }
    }
  }
})

app.listen(8080)
