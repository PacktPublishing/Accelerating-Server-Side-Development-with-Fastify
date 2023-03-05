'use strict'

const dataStore = require('../data-store')

module.exports = fakeAuth
module.exports.prefixOverride = ''

async function fakeAuth (fastify, opts) {
  let loggedIn = false

  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['password'],
        properties: {
          password: { type: 'string', maxLength: 20 }
        }
      }
    }
  },
  async function authHandler (request, reply) {
    try {
      await dataStore.store(request.body)
      reply.statusCode = 201
      return { registered: true }
    } catch (error) {
      reply.statusCode = 500
      return { registered: false }
    }
  })

  fastify.post('/authenticate', async function authHandler (request, reply) {
    if (!dataStore.data().some(user => user.password === request.body.password)) {
      const err = new Error('Wrong credentials provided')
      err.statusCode = 401
      throw err
    }
    loggedIn = true
    return { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' }
  })

  fastify.get('/me', async function meHandler (request, reply) {
    if (!loggedIn) {
      const err = new Error('No Authorization was found in request.headers')
      err.statusCode = 401
      throw err
    }
    return { username: 'John Doe', email: 'doe@email.com' }
  })
}
