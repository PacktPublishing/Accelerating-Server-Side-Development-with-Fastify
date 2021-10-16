'use strict'

module.exports = async function (fastify, opts) {
  console.log('###root route')
  fastify.get('/', async function (request, reply) {
    const e = new Error('this is an error')
    e.statusCode = 201
    e.code = 200
    reply.code(201).send(e)
    // return { root: 'asd' }
  })
}
