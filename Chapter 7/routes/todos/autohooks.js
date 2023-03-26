'use strict'
const fp = require('fastify-plugin')
const schemas = require('./schemas/loader')

module.exports = fp(async function todoAutoHooks (fastify, opts) {
  const todos = fastify.mongo.db.collection('todos')

  fastify.register(schemas)

  fastify.decorate('mongoDataSource', {
    async countTodos (filter = {}) {
      const totalCount = await todos.countDocuments(filter)
      return totalCount
    },
    async listTodos ({
      filter = {},
      projection = {},
      skip = 0,
      limit = 50
    } = {}) {
      if (filter.title) {
        filter.title = new RegExp(filter.title, 'i')
      } else {
        delete filter.title
      }
      const todoDocuments = await todos
        .find(filter, {
          projection: { ...projection, _id: 0 },
          limit,
          skip
        })
        .toArray()
      return todoDocuments
    },
    async createTodo ({ title }) {
      const _id = new fastify.mongo.ObjectId()
      const now = new Date()
      const { insertedId } = await todos.insertOne({
        _id,
        title,
        done: false,
        id: _id,
        createdAt: now,
        modifiedAt: now
      })
      return insertedId
    },
    async readTodo (id, projection = {}) {
      const todo = await todos.findOne(
        { _id: new fastify.mongo.ObjectId(id) },
        { projection: { ...projection, _id: 0 } }
      )
      return todo
    },
    async updateTodo (id, newTodo) {
      return todos.updateOne(
        { _id: new fastify.mongo.ObjectId(id) },
        {
          $set: {
            ...newTodo,
            modifiedAt: new Date()
          }
        }
      )
    },
    async deleteTodo (id) {
      return todos.deleteOne({ _id: new fastify.mongo.ObjectId(id) })
    }
  })
}, {
  encapsulate: true,
  dependencies: ['@fastify/mongodb'],
  name: 'todo-store'
})
