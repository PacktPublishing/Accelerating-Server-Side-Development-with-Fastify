'use strict'

const fp = require('fastify-plugin')

module.exports = fp(function schemaLoaderPlugin (fastify, opts, next) {
  fastify.addSchema(require('./dotenv.json'))

  next()
})
