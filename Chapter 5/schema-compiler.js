'use strict'

const fastify = require('fastify')

const app = fastify({
  logger: true
})
app.addSchema({
  $id: 'http://myapp.com/string.json',
  type: 'string',
  maxLength: 50
})

app.setValidatorCompiler(myValidatorCompiler) // [1]

app.register(async function plugin (instance, opts, next) {
  instance.setValidatorCompiler(myValidatorCompiler) // [2]

  app.post('/schema-ref', {
    handler: echo,
    validatorCompiler: myValidatorCompiler, // [3]
    schema: {
      body: mySchema
    }
  })
})

function myValidatorCompiler (routeData) {
  const { schema, method, url, httpPart } = routeData
  return function validate (jsonPayload) {
    return true
  }
}

app.addSchema({
  $id: 'http://myapp.com/user.json',
  definitions: {
    user: {
      $id: '#usermodel',
      type: 'object',
      properties: {
        name: { type: 'string', maxLength: 50 }
      }
    },
    address: {
      $id: 'address.json',
      definitions: {
        home: { $id: '#house', type: 'string', maxLength: 150 },
        work: { $id: '#job', type: 'string', maxLength: 200 }
      }
    }
  }
})

app.post('/schema-ref', {
  handler: echo,
  schema: {
    body: {
      type: 'object',
      properties: {
        user: { $ref: 'http://myapp.com/user.json#usermodel' },
        homeAdr: { $ref: 'http://myapp.com/address.json#house' },
        jobAdr: {
          $ref: 'http://myapp.com/address.json#/definitions/work'
        },
        notes: { $ref: '#/definitions/local' }
      },
      definitions: {
        local: { type: 'boolean' }
      }
    }
  }
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
