'use strict'

const fastify = require('fastify')

const app = fastify({ logger: true })

const ajvConfigDemoSchema = {
  type: 'object',
  properties: {
    coerceTypesDemo: { type: 'integer' },
    useDefaultsDemo: { type: 'string', default: 'hello' },
    removeAdditional: {
      type: 'object',
      additionalProperties: false,
      properties: {
        onlyThisField: {
          type: 'boolean'
        }
      }
    },
    nullableDemo: { type: 'string', nullable: true },
    notNullableDemo: { type: 'string' }
  }
}

app.post('/config-in-action', {
  schema: {
    body: ajvConfigDemoSchema
  },
  handler (request, reply) {
    reply.send(request.body)
  }
})

app.listen({ port: 8080 })

// curl --location --request POST 'http://localhost:8080/config-in-action' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "coerceTypesDemo": "42",
//     "removeAdditional": {
//         "remove": "me",
//         "onlyThisField": true
//     },
//     "nullableDemo": null,
//     "notNullableDemo": null
// }'
