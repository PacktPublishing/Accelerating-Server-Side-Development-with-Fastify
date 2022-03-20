'use strict'

const { fastify } = require('fastify')
const app = fastify({
  logger: {
    level: 'error',
    // prettyPrint: true,
    serializers: {
      hello: function serializeHello (data) {
        return data.join(',')
      }
    }
  }
})
app.get('/root', helloHandler)

async function helloHandler (request, reply) {
  const hello = ['hello', 'world']
  request.log.debug({ hello })
  return new Error('')
}

app.register(async function plugin (instance, opts) {
  instance.get('/plugin', helloHandler)
}, {
  logLevel: 'trace',
  logSerializers: {
    hello: function serializeHello (data) {
      return data.join(':')
    }
  }
})

app.get('/route', {
  handler: helloHandler,
  logLevel: 'debug',
  logSerializers: {
    hello: function toString (data) {
      return data.join('+')
    }
  }
})

app.inject('/route')
  .then(() => app.inject('/plugin'))
  .then(() => app.inject('/root'))
