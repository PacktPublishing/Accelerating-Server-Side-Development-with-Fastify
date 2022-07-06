'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

const routes = [
  {
    method: 'POST',
    url: '/cat',
    handler: function cat (request, reply) { reply.send('cat') }
  },
  {
    method: 'GET',
    url: '/dog',
    handler: function dog (request, reply) { reply.send('dog') }
  }
]
routes.forEach(routeOptions => app.route(routeOptions))

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
