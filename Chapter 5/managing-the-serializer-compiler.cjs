'use strict'
const fastify = require('fastify')

const app = fastify({
  logger: true,
  serializerOpts: { rounding: 'ceil' },
  schemaController: {
    compilersFactory: {
      buildSerializer: myFactory // [1]
    }
  }
})
app.addSchema({
  $id: 'http://myapp.com/string.json',
  type: 'string'
})
function myFactory (externalSchemas, serializerOptsServerOption) {
  return mySerializerCompiler // [2]
}
function mySerializerCompiler (routeData) {
  // eslint-disable-next-line
  const { schema, method, url, httpStatus } = routeData // [3]
  return function serializer (responsePayload) { // [4]
    return `This is the payload ${responsePayload}`
  }
}

app.get('/serializer-compiler', {
  schema: {
    response: {
      200: {
        $ref: 'http://myapp.com/string.json'
      }
    }
  }
}, function handler (request, reply) {
  reply.send({ hello: 'world' })
})

app.listen({ port: 8080 })
