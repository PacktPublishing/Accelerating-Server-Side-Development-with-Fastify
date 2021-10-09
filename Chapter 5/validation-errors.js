'use strict'

const fastify = require('fastify')

const app = fastify({
  schemaErrorFormatter: function (errors, httpPart) {
    return new Error('root error formatter')
  }
})

const routeConfig = {
  handler: echo,
  schema: {
    query: { myId: { type: 'integer' } }
  }
}

app.register(function plugin (app, opts, next) {
  app.get('/custom-error-handler', routeConfig)

  app.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
      const { validation, validationContext } = error
      this.log.warn({ validationError: validation })
      const errorMessage = `Validation error on ${validationContext}: ${error.message}`
      reply.status(400).send({ fail: errorMessage })
    } else {
      this.log.error(error)
      reply.status(500).send(error)
    }
  })
  next()
})

app.get('/custom-route-error-formatter', {
  handler: echo,
  schema: {
    query: { myId: { type: 'integer' } }
  },
  schemaErrorFormatter: function (errors, httpPart) {
    return new Error('route error formatter')
  }
})

app.register(function plugin (instance, opts, next) {
  instance.get('/custom-error-formatter', routeConfig)
  instance.setSchemaErrorFormatter(function (errors, httpPart) {
    return new Error('plugin error formatter')
  })
  next()
})

app.listen(8080)

async function echo (request, reply) {
  return {
    params: request.params,
    body: request.body,
    query: request.query,
    headers: request.headers
  }
}
