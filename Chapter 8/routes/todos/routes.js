'use strict'

module.exports = async function todoRoutes (fastify, _opts) {
  fastify.addHook('onRequest', fastify.authenticate) // [1]

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      querystring: fastify.getSchema('schema:todo:list:query'),
      response: {
        200: fastify.getSchema('schema:todo:list:response')
      }
    },
    handler: async function listTodo (request, reply) {
      const { skip, limit, title } = request.query

      const todos = await request.todosDataSource.listTodos({ filter: { title }, skip, limit }) // [2]
      const totalCount = await request.todosDataSource.countTodos()
      return { data: todos, totalCount }
    }
  })

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: fastify.getSchema('schema:todo:create:body'),
      response: {
        201: fastify.getSchema('schema:todo:create:response')
      }
    },
    handler: async function createTodo (request, reply) {
      const insertedId = await request.todosDataSource.createTodo(request.body)
      reply.code(201)
      return { id: insertedId }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: fastify.getSchema('schema:todo:read:params'),
      response: {
        200: fastify.getSchema('schema:todo')
      }
    },
    handler: async function readTodo (request, reply) {
      const todo = await request.todosDataSource.readTodo(request.params.id)
      if (!todo) {
        reply.code(404)
        return { error: 'Todo not found' }
      }
      return todo
    }
  })

  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      params: fastify.getSchema('schema:todo:read:params'),
      body: fastify.getSchema('schema:todo:update:body')
    },
    handler: async function updateTodo (request, reply) {
      const res = await request.todosDataSource.updateTodo(request.params.id, request.body)
      if (res.modifiedCount === 0) {
        reply.code(404)
        return { error: 'Todo not found' }
      }

      reply.code(204)
    }
  })

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: fastify.getSchema('schema:todo:read:params')
    },
    handler: async function deleteTodo (request, reply) {
      const res = await request.todosDataSource.deleteTodo(request.params.id)
      if (res.deletedCount === 0) {
        reply.code(404)
        return { error: 'Todo not found' }
      }
      reply.code(204)
    }
  })

  fastify.route({
    method: 'POST',
    url: '/:id/:status',
    schema: {
      params: fastify.getSchema('schema:todo:status:params')
    },
    handler: async function changeStatus (request, reply) {
      const res = await request.todosDataSource.updateTodo(request.params.id,
        { done: request.params.status === 'done' }
      )
      if (res.modifiedCount === 0) {
        reply.code(404)
        return { error: 'Todo not found' }
      }

      reply.code(204)
    }
  })
}
