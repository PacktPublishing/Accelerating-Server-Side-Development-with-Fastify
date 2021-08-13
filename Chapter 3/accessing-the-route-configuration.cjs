'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

async function operation (request, reply) {
  return request.context.config
}
app.get('/', {
  handler: operation,
  config: {
    hello: 'world'
  }
})

app.addHook('preHandler', async function calculatePriority (request) {
  request.priority = request.context.config.priority * 10
})
app.get('/private', {
  handler: schedule,
  config: { priority: 5 }
})
app.get('/public', {
  handler: schedule,
  config: { priority: 1 }
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })

async function schedule () {
  return { scheduled: true }
}
