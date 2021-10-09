'use strict'
const fastify = require('fastify')

const app = fastify({ logger: !true })

function mySerializer (payload, statusCode) {
  return `<payload>${payload}</payload>`
}

// app.setReplySerializer(mySerializer)
// app.get('/reply-serializer-instance', function handler (request, reply) {
//   reply.send({ hello: 'world' })
// })

app.get('/reply-serializer', function handler (request, reply) {
  reply/// .type('application/xml')
    .serializer(mySerializer)
    .send({ hello: 'world' })
})

app.listen(8080)
