
'use strict'

const fastify = require('fastify')

const app = fastify({
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
  const { schema, method, url, httpStatus } = routeData // [3]
  return function serializer (responsePayload) {
    return `This is the payload ${responsePayload}`
  }
}

app.setSerializerCompiler(mySerializerCompiler) // [1]
app.register(async function plugin (instance, opts) {
  instance.setSerializerCompiler(mySerializerCompiler) // [2]
  app.post('/respose-schema', {
    handler: echo,
    serializerCompiler: mySerializerCompiler, // [3]
    schema: {
      response: {
        '2xx': mySchema,
        '5xx': myErrorSchema
      }
    }
  })
})
