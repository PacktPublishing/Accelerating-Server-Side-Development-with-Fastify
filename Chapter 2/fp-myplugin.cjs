const fp = require('fastify-plugin')

async function myPlugin (fastify, _options) {
  console.log('myPlugin decorates the parent instance.')
  fastify.decorate('myPlugin', 'hello from myPlugin.')
}

module.exports = fp(myPlugin, { // [1]
  name: 'myPlugin', // [2]
  fastify: '4.x', // [3]
  decorators: { fastify: ['root'] } // [4]
})
