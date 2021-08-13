'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

app.addHook('onRequest', function hook (request, reply, done) {
  request.log.info('Is a 404 HTTP request? %s', request.is404)
  done()
})

const niceHtmlPage = '<html>...'
app.register(async function plugin (instance, opts) {
  instance.setNotFoundHandler(function html404 (request, reply) {
    reply.type('application/html').send(niceHtmlPage)
  })
}, { prefix: '/site' }) // [1]

app.setNotFoundHandler(function custom404 (request, reply) {
  reply.send({ not: 'found' })
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
