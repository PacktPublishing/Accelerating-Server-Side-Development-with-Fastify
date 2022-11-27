'use strict'

const fp = require('fastify-plugin')
const fastifySensible = require('@fastify/sensible')

module.exports = fp(async function sensiblePlugin (fastify, opts) {
  fastify.register(fastifySensible, {
    errorHandler: false
  })
})
