'use strict'

const fp = require('fastify-plugin')

module.exports = fp(function schemaLoaderPlugin (fastify, opts, next) {
  fastify.addSchema(require('./todo.json'))
  fastify.addSchema(require('./list-response.json'))
  fastify.addSchema(require('./list-query.json'))
  fastify.addSchema(require('./create-body.json'))
  fastify.addSchema(require('./create-response.json'))
  fastify.addSchema(require('./update-body.json'))
  fastify.addSchema(require('./read-params.json'))
  fastify.addSchema(require('./status-params.json'))

  next()
}, { name: 'todo-schemas' })
