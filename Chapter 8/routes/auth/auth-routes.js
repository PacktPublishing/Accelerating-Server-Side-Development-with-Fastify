'use strict'

const crypto = require('crypto')
const util = require('util')
const fastifyJwt = require('@fastify/jwt')

const pbkdf2 = util.promisify(crypto.pbkdf2)

const dataStore = require('../data-store')

module.exports = applicationAuth
module.exports.prefixOverride = ''

// Save the user object to the database

async function applicationAuth (fastify, opts) {
  let loggedIn = false

  fastify.register(fastifyJwt, {
    secret: 'supersecret' // todo better config
  })

  fastify.post('/register', {
    schema: {
      body: fastify.getSchema('schema:auth:register')
    },
    handler: registerHandler
  })

  async function registerHandler (request, reply) {
    const existingUser = await dataStore.readUser(fastify, request.body.username)
    if (existingUser) {
      const err = new Error('User already registered')
      err.statusCode = 409
      throw err
    }

    // Generate a random salt value
    const salt = crypto.randomBytes(16).toString('hex')

    // Hash the password using the salt value and SHA-256 algorithm
    const hash = await pbkdf2(request.body.password, salt, 1000, 64, 'sha256').toString('hex')

    try {
      const newUserId = await dataStore.storeUser(fastify, {
        email: request.body.email,
        salt,
        hash
      })
      request.log.info({ userId: newUserId }, 'User registered')

      reply.code(201)
      return { registered: true }
    } catch (error) {
      request.log.error(error, 'Failed to register user')
      reply.code(500)
      return { registered: false }
    }
  }

  fastify.post('/authenticate', async function authHandler (request, reply) {
    if (!dataStore.data().some(user => user.password === request.body.password)) {
      const err = new Error('Wrong credentials provided')
      err.statusCode = 401
      throw err
    }
    loggedIn = true
    return { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' }
  })

  fastify.post('/refresh', async function authHandler (request, reply) {
    // todo
  })

  fastify.post('/logout', async function authHandler (request, reply) {
    // todo
  })

  fastify.post('/verify', async function authHandler (request, reply) {
    // todo
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
