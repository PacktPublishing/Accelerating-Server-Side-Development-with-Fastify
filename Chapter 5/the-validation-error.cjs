'use strict'

const fastify = require('fastify')

const app = fastify({
  logger: true,
  ajv: {
    customOptions: {
      coerceTypes: 'array',
      removeAdditional: 'all'
    }
  }
})

app.get('/custom-error-handler', {
  handler: echo,
  schema: {
    query: { myId: { type: 'integer' } }
  }
})

app.setErrorHandler(function (error, request, reply) {
  if (error.validation) {
    const { validation, validationContext } = error
    this.log.warn({ validationError: validation })
    const errorMessage = `Validation error on ${validationContext}`
    reply.status(400).send({ fail: errorMessage })
  } else {
    this.log.error(error)
    reply.status(500).send(error)
  }
})

app.listen({ port: 8080 })

async function echo (request, reply) {
  return {
    params: request.params,
    body: request.body,
    query: request.query,
    headers: request.headers
  }
}
