'use strict'

const fastify = require('fastify')

const app = fastify({
  logger: true,
  schemaController: { // [1]
    compilersFactory: {
      buildValidator: myCompilerFactory // [2]
    }
  }
})
app.addSchema({
  $id: 'http://myapp.com/string.json',
  type: 'string',
  maxLength: 50
})
function myCompilerFactory (externalSchemas, ajvServerOption) {
  return myValidatorCompiler // [3]
}
function myValidatorCompiler (routeData) {
  // eslint-disable-next-line
  const { schema, method, url, httpPart } = routeData
  return function validate (jsonPayload) { // [4]
    return true
  }
}

app.get('/success', {
  handler: echo,
  schema: {
    query: { myId: { type: 'integer' } }
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
