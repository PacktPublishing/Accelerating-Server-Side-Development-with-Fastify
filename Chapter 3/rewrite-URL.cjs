const fastify = require('fastify')
const app = fastify({
  logger: true,
  rewriteUrl: function rewriteUrl (rawRequest) {
    console.log('Rewrite url ' + rawRequest.url + rawRequest.url.startsWith('/api'))
    if (rawRequest.url.startsWith('/api')) {
      return rawRequest.url
    }
    return `/public/${rawRequest.url}`
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
