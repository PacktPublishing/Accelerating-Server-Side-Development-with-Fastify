'use strict'
const fastify = require('fastify') // [1]
const serverOptions = { // [2]
  logger: true
}
const app = fastify(serverOptions) // [3]
app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => { // [4]
    // Server is now listening on ${address}
  })
