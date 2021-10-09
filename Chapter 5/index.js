'use strict'

const app = require('fastify')({ logger: true })

const jsonSchemaPathParams = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      minimum: 0,
      maximum: 100000
    }
  }
}

const jsonSchemaBody = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://foo/user',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 50
    },
    hobbies: {
      type: 'array',
      maxItems: 120,
      items: {
        type: 'string',
        maxLength: 45
      }
    }
  },
  required: ['name']
}

const jsonSchemaQuery = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://foo/query',
  type: 'object',
  properties: {
    lang: {
      type: 'string',
      maxLength: 5
    }
  },
  required: ['lang']
}

const jsonSchemaHeaders = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://foo/headers',
  type: 'object',
  properties: {
    'x-api-key': {
      type: 'string',
      maxLength: 80
    }
  },
  required: ['x-api-key']
}

app.post('/:id', {
  handler: echo,
  schema: {
    params: jsonSchemaPathParams,
    body: jsonSchemaBody,
    query: jsonSchemaQuery,
    headers: jsonSchemaHeaders
  }
})

app.get('/attach-validation', {
  attachValidation: true,
  schema: {
    headers: jsonSchemaHeaders
  },
  handler: (request, reply) => {
    reply.send(request.validationError)
  }
})

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

// fastify.setErrorHandler(function (error, request, reply) {
//   this.log.error(error)
//   reply.status(500).send({ ok: false })
// })

app.listen(8080)

async function echo (request, reply) {
  return {
    params: request.params,
    body: request.body,
    query: request.query,
    headers: request.headers
  }
}
