'use strict'

const fp = require('fastify-plugin')

module.exports = fp(function schemaLoaderPlugin (fastify, opts, next) {
  fastify.addSchema(require('./dotenv.json'))
  fastify.addSchema(require('./user.json'))
  fastify.addSchema(require('./auth-token.json'))
  fastify.addSchema(require('./auth-register.json'))

  next()
}, { name: 'application-schemas' })
