'use strict'

module.exports = async function root (fastify, opts) {
  fastify.get('/', async function welcomeHandler (request, reply) {
    return { root: true }
  })
}
