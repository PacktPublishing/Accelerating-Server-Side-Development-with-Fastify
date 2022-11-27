'use strict'

const fp = require('fastify-plugin')

module.exports = fp(function errorHandlerPlugin (fastify, opts, next) {
  fastify.addHook('onRequest', async function onRequestLogHook (req) {
    req.log.info({ req }, 'incoming request 🔮')
  })

  fastify.addHook('onSend', async function onSendRequestLogHook (req, res) {
    req.log.info({ req, res }, 'request completed 🎉')
  })

  fastify.setErrorHandler(function customErrorHandler (err, req, reply) {
    if (reply.statusCode >= 500) {
      req.log.error({ req, res: reply, err }, err?.message)
      const error = new Error(`Fatal error. Contact the support team with the id ${req.id}`)
      reply.send(error)
      return
    }
    req.log.info({ req, res: reply, err }, err?.message)
    reply.send(err)
  })
  next()
})
