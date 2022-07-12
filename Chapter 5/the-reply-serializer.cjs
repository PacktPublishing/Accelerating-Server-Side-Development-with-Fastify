'use strict'
const fastify = require('fastify')

const app = fastify({ logger: !true })

function mySerializer (payload, statusCode) {
  return `<payload>${payload}</payload>`
}

app.setReplySerializer(mySerializer) // [1]
app.get('/reply-serializer', function handler (request, reply) {
  reply.type('application/xml')
    .serializer(mySerializer) // [2]
    .send({ hello: 'world' })
})

app.listen({ port: 8080 })
