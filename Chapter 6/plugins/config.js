'use strict'

const fp = require('fastify-plugin')
const fastifyEnv = require('@fastify/env')

module.exports = fp(async function configLoader (fastify, opts) {
  await fastify.register(fastifyEnv, {
    confKey: 'secrets',
    schema: fastify.getSchema('schema:dotenv')
  })
},
{ name: 'application-config' })
