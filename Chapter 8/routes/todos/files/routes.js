'use strict'

const fastifyMultipart = require('@fastify/multipart')
const { parse: csvParse } = require('csv-parse')

module.exports = fileTodoRoutes

async function fileTodoRoutes (fastify, _opts) {
  await fastify.register(fastifyMultipart, {
    attachFieldsToBody: 'keyValues',
    async onFile (part) {
      const lines = []

      const stream = part.file.pipe(csvParse({
        bom: true,
        skip_empty_lines: true,
        trim: true,
        columns: true
      }))

      for await (const line of stream) {
        lines.push({
          title: line.title,
          done: line.done === 'true'
        })
      }

      part.value = lines
    },
    sharedSchemaId: 'schema:todo:import:file',
    limits: {
      fieldNameSize: 50,
      fieldSize: 100,
      fields: 10,
      fileSize: 1_000_000, // The max file size in bytes (1MB)
      files: 1
    }
  })

  // All routes in this file are protected by the authRoute hook
  fastify.addHook('onRequest', fastify.authRoute)

  //
  fastify.route({
    method: 'POST',
    url: '/import',
    schema: {
      body: {
        type: 'object',
        required: ['todoListFile'],
        description: 'Import a todo list from a CSV file with the following format: title,done',
        properties: {
          todoListFile: {
            type: 'array',
            items: {
              type: 'object',
              required: ['title', 'done'],
              properties: {
                title: { type: 'string' },
                done: { type: 'boolean' }
              }
            }
          }
        }
      },
      response: {
        201: {
          type: 'array',
          items: fastify.getSchema('schema:todo:create:response')
        }
      }
    },
    handler: async function listTodo (request, reply) {
      const datasource = request.mongoDataSource()
      const inserted = await datasource.createTodos(request.body.todoListFile)
      reply.code(201)
      return inserted
    }
  })
}
