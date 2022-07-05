'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: {
    level: 'debug'
  },
  rewriteUrl: function rewriteUrl (rawRequest) {
    const { url } = rawRequest
    console.log(`Rewrite url ${url}: ${url.startsWith('/api')}`)
    if (url.startsWith('/api')) {
      return url
    }
    return `/public${url}`
  }
})

// http://localhost:8080/foo will run this handler
app.get('/public/*', async (request) => {
  return { requested: request.url }
})

// http://localhost:8080/api/foo will run this handler
app.get('/api/*', async (request) => {
  return { api: true }
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
