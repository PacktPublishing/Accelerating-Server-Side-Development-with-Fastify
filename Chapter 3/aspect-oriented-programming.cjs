'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

app.addHook('onRoute', function hook (routeOptions) {
  if (routeOptions.config.private === true) {
    routeOptions.onRequest = async function auth (request) {
      if (request.headers.token !== 'admin') {
        const authError = new Error('Private zone')
        authError.statusCode = 401
        throw authError
      }
    }
  }
})
app.get('/private', {
  config: { private: true },
  handler
})
app.get('/public', {
  config: { private: false },
  handler
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })

async function handler () { return 'hello' }
