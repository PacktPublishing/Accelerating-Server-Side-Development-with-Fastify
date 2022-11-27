'use strict'

const fp = require('fastify-plugin')
const fastifyMongo = require('@fastify/mongodb')

module.exports = fp(async function datasourcePlugin (fastify, opts) {
  fastify.register(fastifyMongo, {
    serverSelectionTimeoutMS: 2000,
    forceClose: true,
    maxPoolSize: 20,
    minPoolSize: 10,
    url: fastify.secrets.MONGO_URL
  })
}, {
  dependencies: ['application-config']
})
