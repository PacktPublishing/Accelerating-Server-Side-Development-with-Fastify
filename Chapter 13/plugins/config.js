'use strict'

const fp = require('fastify-plugin')
const fastifyEnv = require('@fastify/env')

module.exports = fp(async function configLoader (fastify, opts) {
  await fastify.register(fastifyEnv, {
    confKey: 'secrets',
    data: opts.configData,
    schema: fastify.getSchema('schema:dotenv')
  })

  fastify.log.level = fastify.secrets.LOG_LEVEL
},
{
  name: 'application-config',
  dependencies: ['application-schemas']
})
