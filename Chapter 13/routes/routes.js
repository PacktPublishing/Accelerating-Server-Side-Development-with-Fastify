'use strict'

module.exports = async function root (fastify, opts) {
  fastify.get('/', async function welcomeHandler (request, reply) {
    return { root: true }
  })
  fastify.post('/login', {
    config: { logBody: true },
    handler: async function testLog (request, reply) {
      // 'aa'.filter()
      request.log.info({ res: reply }, 'read the database')
      return { root: true }
    }
  })

  fastify.get('/todos', {
    handler: async function readTodosFromMongo (request, reply) {
      const todos = await this.mongo.db.collection('foo').find({}).toArray()
      return todos
    }
  })

  fastify.get('/todos-flame', {
    handler: async function readTodosFromMongo (request, reply) {
      // try it with the "npm run clinic:flame" command
      require('fs').readFileSync(__filename) // waste CPU cycles
      const todos = await this.mongo.db.collection('foo').find({}).toArray()
      return todos
    }
  })

  const simpleCache = new Map()
  fastify.get('/todos-heap', {
    handler: async function readTodosFromMongo (request, reply) {
      // try it with the "npm run clinic:heap" command
      const cacheKey = 'todos-' + request.id
      if (simpleCache.has(cacheKey)) {
        return simpleCache.get(cacheKey)
      }
      const todos = Array.from(1e6).fill('*')
      simpleCache.set(cacheKey, todos)
      return todos
    }
  })
}
