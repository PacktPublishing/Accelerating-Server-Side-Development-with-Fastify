'use strict'
const fastify = require('fastify')

const app = fastify({ logger: !true })

app.addHook('preSerialization', (request, reply, payload, done) => {
  console.log(payload)
  done(new Error('ciao'), null)
})

app.setErrorHandler(function (error, request, reply) {
  console.log('setErrorHandler', { error })
  // reply.status(500).send({ ok: false, error: error.message })
  reply.code(505).send({ error: 'gestito' })
})

app.get('/ok', {
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  }
},
async (request, reply) => {
  return { hello: 'foo', bar: 'baz' }
})

app.listen(8080)
