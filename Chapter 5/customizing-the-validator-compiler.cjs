'use strict'

const fastify = require('fastify')

const app = fastify({ logger: true })

const jsonSchemaHeaders = {
  type: 'object',
  properties: {
    'x-custom-header': {
      type: 'string',
      minLength: 10
    }
  },
  required: ['x-custom-header']
}

app.get('/attach-validation', {
  attachValidation: true,
  schema: {
    headers: jsonSchemaHeaders
  },
  handler: (request, reply) => {
    reply.send(request.validationError)
  }
})

app.listen({ port: 8080 })
