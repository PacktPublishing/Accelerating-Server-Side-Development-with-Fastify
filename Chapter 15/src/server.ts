import { join } from 'node:path'
import Fastify from 'fastify'
import AutoLoad from '@fastify/autoload'
import Swagger from '@fastify/swagger'
import SwaggerUI from '@fastify/swagger-ui'

const fastify = Fastify({ logger: true })

void fastify.register(Swagger, {
  swagger: {
    info: {
      title: 'Cool App Documentation',
      description: 'Testing the Fastify swagger API',
      version: '1.0.0'
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [{
      name: 'Hello World',
      description: 'You can use these routes to salute whomever you want.'
    }]
  }
})
void fastify.register(SwaggerUI, {
  routePrefix: '/documentation'
})

void fastify.register(AutoLoad, {
  dir: join(__dirname, 'routes')
})

fastify
  .listen({ host: '0.0.0.0', port: 3000 })
  .catch((err) => {
    fastify.log.error(err)
    process.exit(1)
  })
