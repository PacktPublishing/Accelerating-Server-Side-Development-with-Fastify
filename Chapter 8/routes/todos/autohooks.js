'use strict'
const fp = require('fastify-plugin')
const schemas = require('./schemas/loader')

module.exports = fp(todoAutoHooks, {
  dependencies: ['@fastify/mongodb'],
  name: 'todo-store'
})

async function todoAutoHooks (fastify, opts) {
  const todos = fastify.mongo.db.collection('todos')

  fastify.register(schemas)

  fastify.decorateRequest('mongoDataSource', function () {
    const req = this
    return {
      async countTodos (filter = {}) {
        filter.userId = req.user.id
        const totalCount = await todos.countDocuments(filter)
        return totalCount
      },

      async listTodos ({
        filter,
        projection = {},
        skip = 0,
        limit = 50,
        asStream = false
      } = {}) {
        if (filter.title) {
          filter.title = new RegExp(filter.title, 'i')
        } else {
          delete filter.title
        }
        filter.userId = req.user.id

        const cursor = todos
          .find(filter, {
            projection: { ...projection, _id: 0 },
            limit,
            skip,
            sort: { createdAt: -1 }
          })

        if (asStream) {
          return cursor.stream()
        }

        return await cursor.toArray()
      },

      async createTodo ({ title }) {
        const _id = new fastify.mongo.ObjectId()
        const now = new Date()
        const userId = req.user.id
        const { insertedId } = await todos.insertOne({
          _id,
          userId,
          title,
          done: false,
          id: _id,
          createdAt: now,
          modifiedAt: now
        })
        return insertedId
      },

      async createTodos (todoList) {
        const now = new Date()
        const userId = req.user.id
        const toInsert = todoList.map(rawTodo => {
          const _id = new fastify.mongo.ObjectId()

          return {
            _id,
            userId,
            ...rawTodo,
            id: _id,
            createdAt: now,
            modifiedAt: now
          }
        })
        await todos.insertMany(toInsert)
        return toInsert
      },

      async readTodo (id, projection = {}) {
        const todo = await todos.findOne(
          { _id: new fastify.mongo.ObjectId(id), userId: req.user.id },
          { projection: { ...projection, _id: 0 } }
        )
        return todo
      },

      async updateTodo (id, newTodo) {
        return await todos.updateOne(
          { _id: new fastify.mongo.ObjectId(id), userId: req.user.id },
          {
            $set: {
              ...newTodo,
              userId: req.user.id,
              modifiedAt: new Date()
            }
          }
        )
      },

      async deleteTodo (id) {
        return await todos.deleteOne({ _id: new fastify.mongo.ObjectId(id), userId: req.user.id })
      }
    }
  })
}
