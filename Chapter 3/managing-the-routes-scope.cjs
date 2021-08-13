'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

//  Try it with
// curl --location --request GET 'http://localhost:8080/private' --header 'x-api-key: GUEST'
app.get('/private', function handle (request, reply) {
  reply.send({ secret: 'data' })
})
app.register(function privatePlugin (instance, opts, next) {
  // Uncomment me
  // instance.get('/private', function handle (request, reply) {
  //   reply.send({ secret: 'data' })
  // })

  instance.addHook('onRequest', function isAdmin (request, reply, done) {
    if (request.headers['x-api-key'] === 'ADM1N') {
      done()
    } else {
      done(new Error('you are not an admin'))
    }
  })
  next()
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
