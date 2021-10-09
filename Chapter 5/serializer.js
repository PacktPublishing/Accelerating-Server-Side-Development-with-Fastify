'use strict'
const fastify = require('fastify')

const app = fastify({ logger: !true })

app.addHook('preSerialization', (request, reply, payload, done) => {
  console.log({ payload })
  // done(new Error('serial'), null)
  done(null, 'aoaoaoaoaaoaoa')
})

app.setReplySerializer(function (payload, statusCode) {
  // serialize the payload with a sync function
  console.log('setReplySerializer', payload)

  // if (payload.error) {
  //   return 'ops gestito'
  // }
  // throw payload
  return 'reply serial'
})

app.setErrorHandler(function (error, request, reply) {
  console.log('setErrorHandler', { error })
  // reply.status(500).send({ ok: false, error: error.message })
  reply.code(505).send({ error: 'gestito' })
})

// app.setSerializerCompiler(({ schema, method, url, httpStatus }) => {
//   return data => {
//     console.log('aaaaaaaaaaaaaaa', data)
//     return 'data'
//   }
// })

app.get('/ok', {
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
      // '5xx': {
      //   type: 'object',
      //   properties: {
      //     message: { type: 'string' }
      //   }
      // }
    }
  }
},
(request, reply) => {
  reply.code(400)
  return reply.send(new Error('asd'))
  // return { aaaa: 1111 } // { hello: 'world', add: 11 }
  // return 'sososos'
})
app.get('/ko', async (request, reply) => {
})

app.listen(8080)
