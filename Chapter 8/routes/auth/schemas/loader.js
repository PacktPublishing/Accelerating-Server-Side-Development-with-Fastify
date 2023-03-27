'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function schemaLoaderPlugin (fastify, opts) {
  fastify.addSchema(require('./register.json'))
  fastify.addSchema(require('./token-header.json'))
  fastify.addSchema(require('./token.json'))
  fastify.addSchema(require('./user.json'))
})
