'use strict'
const fastify = require('fastify')
const app = fastify({
  caseSensitive: false,
  logger: true
})

app.get('/FOOBAR', function (request, reply) {
  reply.send({
    url: request.url, // [1]
    routeUrl: request.routerPath // [2]
  })
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
