'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

async function errorTrigger (request, reply) {
  throw new Error('ops')
}

app.register(async function plugin (pluginInstance) {
  pluginInstance.setErrorHandler(function (error, request, reply) {
    request.log.error(error, 'an error happened')
    reply.status(503).send({ ok: false })
  })

  // This route run the pluginInstance's error handler
  pluginInstance.get('/customError', errorTrigger) // [1]
})

// This route run the default app's error handler
app.get('/defaultError', errorTrigger) // [2]

// The route error handler is executed
app.get('/routeError', {
  handler: errorTrigger,
  errorHandler: async function (error, request, reply) {
    request.log.error(error, 'a route error happened')
    return { routeFail: false }
  }
})

// The error handler is not called
app.get('/manualError', (request, reply) => {
  try {
    const foo = request.param.id.split('-') // this line throws
    reply.send(`I split the id ${foo}!`)
  } catch (error) {
    reply.code(500).send({ error: 'I did not split the id!' })
  }
})

app.register(async function plugin (pluginInstance) {
  pluginInstance.setErrorHandler(function first (error, request, reply) {
    request.log.error(error, 'an error happened')
    reply.status(503).send({ ok: false }) // [4]
  })

  pluginInstance.register(async function childPlugin (deep, opts) {
    deep.setErrorHandler(async function second (error, request, reply) {
      const canIManageThisError = error.code === 'yes, you can' // [2]
      if (canIManageThisError) {
        reply.code(503)
        return { deal: true }
      }
      throw error // [3]
    })

    // This route run the deep's error handler
    deep.get('/deepError',
      () => { throw new Error('ops') }) // [1]
  })
})

// This route will crash the server due a TypeError Exception!
app.get('/fatalError', (request, reply) => {
  setTimeout(() => {
    const foo = request.param.id.split('-') // wrong line throws!
    reply.send(`I split the id ${foo}!`)
  })
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
