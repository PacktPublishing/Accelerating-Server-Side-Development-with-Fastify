'use strict'

const fp = require('fastify-plugin')
const fastifyCors = require('@fastify/cors')

module.exports = fp(async function corsPlugin (fastify, opts) {
  fastify.register(fastifyCors, {
    origin: false
  })
})
