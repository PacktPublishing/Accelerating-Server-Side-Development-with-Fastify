'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

function syncHandler (request, reply) {
  readDb(function callbackOne (l, data1) {
    readDb(function callbackTwo (l, data2) {
      reply.send(`read from db ${data1} and ${data2}`)
    })
  })
}

async function asyncHandler (request, reply) {
  const data1 = await readDb()
  const data2 = await readDb()
  return `read from db ${data1} and ${data2}`
}

app.get('/sync', syncHandler)
app.get('/async', asyncHandler)

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })

function readDb (cb) {
  if (cb) {
    setTimeout(cb, 500)
    return
  }

  return new Promise((resolve, reject) => {
    setTimeout(resolve, 500)
  })
}
