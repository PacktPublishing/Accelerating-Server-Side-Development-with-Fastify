'use strict'

const fp = require('fastify-plugin')
const fastifySwagger = require('@fastify/swagger')
const pkg = require('../package.json')

module.exports = fp(async function swaggerPlugin (fastify, opts) {
  fastify.register(fastifySwagger, {
    routePrefix: '/docs',
    exposeRoute: fastify.secrets.NODE_ENV !== 'production',
    swagger: {
      info: {
        title: 'Fastify app',
        description: 'Fastify Book examples',
        version: pkg.version
      }
    }
  })
}, { dependencies: ['application-config'] })
