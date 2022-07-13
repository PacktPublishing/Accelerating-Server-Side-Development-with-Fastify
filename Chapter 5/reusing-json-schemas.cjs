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
        user: { $ref: 'http://myapp.com/user.json#usermodel' }, // [1]
        homeAdr: { $ref: 'http://myapp.com/address.json#house' }, // [2]
        jobAdr: {
          $ref: 'http://myapp.com/address.json#/definitions/work' // [3]
        },
        notes: { $ref: '#/definitions/local' } // [4]
      },
      definitions: {
        local: { type: 'boolean' }
      }
    }
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
