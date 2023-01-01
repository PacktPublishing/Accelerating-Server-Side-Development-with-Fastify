'use strict'

module.exports = async function todoRoutes (fastify, _opts) {
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

      const todos = await this.store.listTodos({ filter: { title }, skip, limit })
      const totalCount = await this.store.countTodos()
      reply.send({ data: todos, totalCount })
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
      const insertedId = await this.store.createTodo(request.body)
      reply.code(201).send({ id: insertedId })
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
      const todo = await this.store.readTodo(request.params.id)
      if (!todo) {
        reply.code(404).send({ error: 'Todo not found' })
        return
      }
      reply.send(todo)
    }
  })
  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      params: fastify.getSchema('schema:todo:read:params'),
      body: fastify.getSchema('schema:todoc:create:body')
    },
    handler: async function updateTodo (request, reply) {
      await this.store.updateTodo(request.params.id, request.body)
      reply.send()
    }
  })
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: fastify.getSchema('schema:todo:read:params')
    },
    handler: async function deleteTodo (request, reply) {
      await this.store.deleteTodo(request.params.id)
      reply.code(204).send()
    }
  })
  fastify.route({
    method: 'POST',
    url: '/:id/:status',
    schema: {
      params: fastify.getSchema('schema:todo:status:params')
    },
    handler: async function doneTodo (request, reply) {
      await this.store.updateTodo(request.params.id, { done: true })
      reply.send()
    }
  })
}
