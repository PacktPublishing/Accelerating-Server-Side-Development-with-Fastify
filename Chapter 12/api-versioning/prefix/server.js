const fastify = require('fastify')()

fastify.register(require('@fastify/autoload'), {
  dir: `${__dirname}/services`
})

fastify.register(require('@fastify/autoload'), {
  dir: `${__dirname}/routes`
})

/*
fastify.register(require('./services/posts'))
fastify.register(require('./routes/v1/posts'), { prefix: '/v1' })
fastify.register(require('./routes/v2/posts'), { prefix: '/v2' })
*/

fastify.listen({ port: 3000 })
