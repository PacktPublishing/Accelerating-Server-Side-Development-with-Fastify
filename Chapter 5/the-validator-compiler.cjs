'use strict'

const fastify = require('fastify')

const app = fastify({ logger: true })

const jsonSchemaPathParams = {
  type: 'object',
  properties: {
    myInteger: {
      type: 'integer',
      minimum: 0,
      maximum: 100
    }
  }
}

const jsonSchemaBody = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://foo/user',
  type: 'object',
  properties: {
    identifier: {
      type: 'integer'
    },
    name: {
      type: 'string',
      maxLength: 50
    },
    hobbies: {
      type: 'array',
      items: {
        type: 'number'
      }
    }
  },
  required: ['identifier', 'name']
}

const jsonSchemaQuery = {
  type: 'object',
  properties: {
    lang: {
      type: 'string',
      enum: ['en', 'it']
    }
  }
}

const jsonSchemaHeaders = {
  type: 'object',
  properties: {
    'x-custom-header': {
      type: 'string',
      minLength: 10
    }
  }
}

app.post('/echo/:myInteger', {
  schema: {
    params: jsonSchemaPathParams,
    body: jsonSchemaBody,
    querystring: jsonSchemaQuery,
    headers: jsonSchemaHeaders
  }
}, function handler (request, reply) {
  reply.send(request.body)
})

app.listen({ port: 8080 })
