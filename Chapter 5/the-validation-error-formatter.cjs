'use strict'

const fastify = require('fastify')

const app = fastify({
  schemaErrorFormatter: function (errors, httpPart) { // [1]
    return new Error('root error formatter')
  }
})
app.get('/custom-route-error-formatter', {
  handler: echo,
  schema: { query: { myId: { type: 'integer' } } },
  schemaErrorFormatter: function (errors, httpPart) { // [2]
    return new Error('route error formatter')
  }
})
app.register(function plugin (instance, opts, next) {
  instance.get('/custom-error-formatter', {
    handler: echo,
    schema: { query: { myId: { type: 'integer' } } }
  })
  instance.setSchemaErrorFormatter(function (errors, httpPart) { // [3]
    return new Error('plugin error formatter')
  })
  next()
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
