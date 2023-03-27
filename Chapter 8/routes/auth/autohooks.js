'use strict'
const fp = require('fastify-plugin')
const schemas = require('./schemas/loader')

module.exports = fp(async function userAutoHooks (fastify, opts) {
  const users = fastify.mongo.db.collection('users')

  fastify.register(schemas)

  fastify.decorate('usersDataSource', { // [1]
    async readUser (username) { // [2]
      const user = await users.findOne({ username })
      return user
    },
    async createUser (user) { // [3]
      const newUser = await users.insertOne(user)
      return newUser.insertedId
    }
  })
}, {
  encapsulate: true,
  dependencies: ['@fastify/mongodb']
})
