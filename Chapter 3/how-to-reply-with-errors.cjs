'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

function syncHandler (request, reply) {
  const myErr = new Error('this is a 500 error')
  reply.send(myErr) // [1]
}

async function ayncHandler (request, reply) {
  const myErr = new Error('this is a 500 error')
  throw myErr // [2]
}

async function ayncHandlerCatched (request, reply) {
  try {
    await ayncHandler(request, reply)
  } catch (err) { // [3]
    this.log.error(err)
    reply.status(200)
    return { success: false }
  }
}

async function customError (request, reply) {
  const err = new Error('app error')
  err.code = 'ERR-001'
  err.statusCode = 400
  throw err
}

app.get('/syncError', syncHandler)
app.get('/asyncError', ayncHandler)
app.get('/asyncErrorManaged', ayncHandlerCatched)
app.get('/customError', customError)

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
