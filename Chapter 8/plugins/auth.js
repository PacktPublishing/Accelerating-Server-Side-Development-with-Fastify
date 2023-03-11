'use strict'

const fp = require('fastify-plugin')
const fastifyJwt = require('@fastify/jwt')

module.exports = fp(async function authenticationPlugin (fastify, opts) {
  const revokedTokens = new Map()

  fastify.register(fastifyJwt, {
    secret: fastify.secrets.JWT_SECRET,
    trusted: skipRevokedTokens
  })

  fastify.decorate('authRoute', async function authRoute (request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  fastify.decorateRequest('revokeToken', function () {
    revokedTokens.set(this.user.jti, true)
  })

  fastify.decorateRequest('generateToken', async function () {
    const token = await fastify.jwt.sign({ username: this.user.username }, {
      jti: String(Date.now()),
      expiresIn: fastify.secrets.JWT_EXPIRE_IN
    })

    return token
  })

  // todo: remove async https://github.com/fastify/fastify-jwt/pull/278
  async function skipRevokedTokens (request, decodedToken) {
    return !revokedTokens.has(decodedToken.jti)
  }
}, {
  name: 'authentication-config',
  dependencies: ['application-config']
})
