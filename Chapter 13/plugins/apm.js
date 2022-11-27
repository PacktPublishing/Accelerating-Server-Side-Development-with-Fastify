'use strict'

const fp = require('fastify-plugin')

module.exports = fp(function errorHandlerPlugin (fastify, opts, next) {
  // fastify.register(openTelemetryPlugin, { wrapRoutes: true })

  next()
})
