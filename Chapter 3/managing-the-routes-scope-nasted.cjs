'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

//  Try it with
// curl --location --request GET 'http://localhost:8080/onlyAdmin' --header 'level: 50'
app.addHook('onRequest', function parseUserHook (request, reply, done) {
  const level = parseInt(request.headers.level) || 0
  request.user = { level, isAdmin: level === 42 }
  done()
})
app.get('/public', handler)
app.register(rootChildPlugin)
async function rootChildPlugin (plugin) {
  plugin.addHook('onRequest', function level99Hook (request, reply, done) {
    if (request.user.level < 99) {
      done(new Error('You need an higher level'))
      return
    }
    done()
  })
  plugin.get('/onlyLevel99', handler)
  plugin.register(childPlugin)
}
async function childPlugin (plugin) {
  plugin.addHook('onRequest', function adminHook (request, reply, done) {
    if (!request.isAdmin) {
      done(new Error('You are not an admin'))
      return
    }
    done()
  })

  plugin.get('/onlyAdmin', handler)
}

function handler (request, reply) {
  reply.send({ user: request.user })
}

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
