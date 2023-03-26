'use strict'

const fp = require('fastify-plugin')
const fastifyJwt = require('@fastify/jwt')

module.exports = fp(async function authenticationPlugin (fastify, opts) {
  const revokedTokens = new Map() // [1]

  fastify.register(fastifyJwt, { // [2]
    secret: fastify.secrets.JWT_SECRET,
    trusted: skipRevokedTokens
  })

  fastify.decorate('authRoute', async function authRoute (request, reply) { // [3]
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  fastify.decorateRequest('revokeToken', function () { // [4]
    revokedTokens.set(this.user.jti, true)
  })

  fastify.decorateRequest('generateToken', async function () { // [5]
    const token = await fastify.jwt.sign({
      id: String(this.user._id),
      username: this.user.username
    }, {
      jti: String(Date.now()),
      expiresIn: fastify.secrets.JWT_EXPIRE_IN
    })

    return token
  })

  // todo: remove async https://github.com/fastify/fastify-jwt/pull/278
  async function skipRevokedTokens (request, decodedToken) { // [6]
    return !revokedTokens.has(decodedToken.jti)
  }
}, {
  name: 'authentication-config',
  dependencies: ['application-config']
})
