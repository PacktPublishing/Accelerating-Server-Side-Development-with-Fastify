'use strict'

const crypto = require('node:crypto')
const util = require('node:util')

const fp = require('fastify-plugin')

const dataStore = require('../data-store')

const pbkdf2 = util.promisify(crypto.pbkdf2)

module.exports = fp(applicationAuth, {
  name: 'auth-routes',
  encapsulate: true,
  dependencies: ['authentication-config']
})
module.exports.prefixOverride = ''

// Save the user object to the database

async function applicationAuth (fastify, opts) {
  fastify.post('/register', {
    handler: registerHandler,
    schema: {
      body: fastify.getSchema('schema:auth:register')
    }
  })

  fastify.post('/authenticate', {
    handler: authenticateHandler,
    schema: {
      body: fastify.getSchema('schema:auth:register'),
      response: {
        200: fastify.getSchema('schema:auth:token')
      }
    }
  })

  fastify.get('/me', {
    handler: async function meHandler (request, reply) {
      return request.user
    },
    onRequest: fastify.authRoute,
    schema: {
      headers: fastify.getSchema('schema:auth:token-header'),
      response: {
        200: fastify.getSchema('schema:user')
      }
    }
  })

  fastify.post('/refresh', {
    handler: refreshHandler,
    onRequest: fastify.authRoute,
    schema: {
      headers: fastify.getSchema('schema:auth:token-header'),
      response: {
        200: fastify.getSchema('schema:auth:token')
      }
    }
  })

  fastify.post('/logout', {
    handler: async function logoutHandler (request, reply) {
      request.revokeToken()
      reply.code(204)
    },
    onRequest: fastify.authRoute
  })

  async function registerHandler (request, reply) {
    const existingUser = await dataStore.readUser(fastify, request.body.username)
    if (existingUser) {
      const err = new Error('User already registered')
      err.statusCode = 409
      throw err
    }

    const { hash, salt } = await generateHash(request.body.password)

    try {
      const newUserId = await dataStore.storeUser(fastify, {
        username: request.body.username,
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

  async function authenticateHandler (request, reply) {
    const user = await dataStore.readUser(fastify, request.body.username)

    if (!user) {
      // if we return 404, an attacker can use this to find out which users are registered
      const err = new Error('Wrong credentials provided')
      err.statusCode = 401
      throw err
    }

    const { hash } = await generateHash(request.body.password, user.salt)
    if (hash !== user.hash) {
      const err = new Error('Wrong credentials provided')
      err.statusCode = 401
      throw err
    }

    request.user = user
    return refreshHandler(request, reply)
  }

  async function refreshHandler (request, reply) {
    const token = await request.generateToken()
    return { token }
  }
}

async function generateHash (password, salt) {
  if (!salt) {
    // Generate a random salt value
    salt = crypto.randomBytes(16).toString('hex')
  }

  // Hash the password using the salt value and SHA-256 algorithm
  const hash = (await pbkdf2(password, salt, 1000, 64, 'sha256')).toString('hex')
  return { salt, hash }
}
