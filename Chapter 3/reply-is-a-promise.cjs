'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

function oldEndpoint (request, reply) {
  readDb(function callbackOne (l, data1) {
    readDb(function callbackTwo (l, data2) {
      reply.send(`read from db ${data1} and ${data2}`)
    })
  })
}

async function newEndpoint (request, reply) {
  if (request.body.type === 'old') { // [1]
    oldEndpoint(request, reply)
    return reply // [2]
  } else {
    const newData = await something(request.body)
    return { done: newData }
  }
}

app.get('/mixedHandlers', newEndpoint)

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })

function something (options) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 500)
  })
}

function readDb (cb) {
  setTimeout(cb, 500)
}
