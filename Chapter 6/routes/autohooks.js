'use strict'
const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  console.log('-------------------------------------------------------authohooks')

  fastify.addHook('onRequest', function hook (request, reply, done) {
    console.log('-------------------------------------------------------authohooks onRequest')
    done()
  })
})
