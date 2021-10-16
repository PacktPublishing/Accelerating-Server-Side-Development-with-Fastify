'use strict'

const S = require('fluent-schema')

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
const fp = require('fastify-plugin')
module.exports = fp(function (fastify, opts, next) {
  fastify.addSchema(require('./dotenv.json'))
  // fastify.addSchema(S.object()
  //   .id('schema:user-input')
  //   .prop('fullname', S.string().required())
  //   .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  // )
  // fastify.addSchema(S.object()
  //   .id('schema:user-update')
  //   .prop('fullname', S.string().required())
  //   .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  // )
  next()
})
