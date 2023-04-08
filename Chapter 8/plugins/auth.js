'use strict'

const fp = require('fastify-plugin')
const fastifyJwt = require('@fastify/jwt') // [1]

module.exports = fp(async function authenticationPlugin (fastify, opts) {
  const revokedTokens = new Map() // [2]

  fastify.register(fastifyJwt, { // [3]
    secret: fastify.secrets.JWT_SECRET,
    trusted: function isTrusted (request, decodedToken) {
      return !revokedTokens.has(decodedToken.jti)
    }
  })

  fastify.decorate('authenticate', async function authenticate (request, reply) { // [4]
    try {
      await request.jwtVerify() // [5]
    } catch (err) {
      reply.send(err)
    }
  })

  fastify.decorateRequest('revokeToken', function () { // [6]
    revokedTokens.set(this.user.jti, true)
  })

  fastify.decorateRequest('generateToken', async function () { // [7]
    const token = await fastify.jwt.sign({
      id: String(this.user._id),
      username: this.user.username
    }, {
      jti: String(Date.now()),
      expiresIn: fastify.secrets.JWT_EXPIRE_IN
    })

    return token
  })
}, {
  name: 'authentication-plugin',
  dependencies: ['application-config']
})
