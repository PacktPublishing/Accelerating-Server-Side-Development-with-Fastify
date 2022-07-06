'use strict'
const fastify = require('fastify')
const app = fastify({
  ignoreTrailingSlash: false, // PLAY with this setting: set it to `true`
  logger: true
})

app.get('/foo', function (request, reply) {
  reply.send('plain foo')
})
app.get('/foo/', function (request, reply) {
  reply.send('foo with trailing slash')
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
