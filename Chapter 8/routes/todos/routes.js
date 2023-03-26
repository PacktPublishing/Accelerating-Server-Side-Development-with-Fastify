'use strict'

module.exports = todoRoutes

async function todoRoutes (fastify, _opts) {
  // All routes in this file are protected by the authRoute hook
  fastify.addHook('onRequest', fastify.authRoute)

  //
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

      const todos = await request.mongoDataSource().listTodos({ filter: { title }, skip, limit })
      const totalCount = await request.mongoDataSource().countTodos()
      return { data: todos, totalCount }
    }
  })

  //
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
      const insertedId = await request.mongoDataSource().createTodo(request.body)
      reply.code(201)
      return { id: insertedId }
    }
  })

  //
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
      const todo = await request.mongoDataSource().readTodo(request.params.id)
      if (!todo) {
        reply.code(404)
        return { error: 'Todo not found' }
      }
      return todo
    }
  })

  //
  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      params: fastify.getSchema('schema:todo:read:params'),
      body: fastify.getSchema('schema:todo:update:body')
    },
    handler: async function updateTodo (request, reply) {
      const res = await request.mongoDataSource().updateTodo(request.params.id, request.body)
      if (res.modifiedCount === 0) {
        reply.code(404)
        return { error: 'Todo not found' }
      }

      reply.code(204)
    }
  })

  //
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: fastify.getSchema('schema:todo:read:params')
    },
    handler: async function deleteTodo (request, reply) {
      const res = await request.mongoDataSource().deleteTodo(request.params.id)
      if (res.deletedCount === 0) {
        reply.code(404)
        return { error: 'Todo not found' }
      }

      reply.code(204)
    }
  })

  //
  fastify.route({
    method: 'POST',
    url: '/:id/:status',
    schema: {
      params: fastify.getSchema('schema:todo:status:params')
    },
    handler: async function doneTodo (request, reply) {
      const res = await request.mongoDataSource().updateTodo(request.params.id,
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
