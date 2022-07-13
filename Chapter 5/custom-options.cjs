'use strict'

const fastify = require('fastify')

const app = fastify({
  logger: true,
  ajv: {
    customOptions: {
      coerceTypes: 'array',
      removeAdditional: 'all'
    },
    plugins: [
      require('ajv-keywords'), // [1]
      [ // [2]
        require('ajv-keywords'),
        'transform'
      ]
    ]
  }
})

app.get('/search', {
  handler: echo,
  schema: {
    query: {
      item: {
        type: 'array',
        maxItems: 10,
        items: {
          type: 'string',
          transform: ['toLowerCase']
        }
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
