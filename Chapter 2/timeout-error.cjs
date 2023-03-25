const Fastify = require('fastify')

const app = Fastify({ logger: true })

app.register(function myPlugin (fastify) {
  console.log('Registering my first plugin.')
})

app.ready()
  .then(() => {
    app.log.info('app ready')
  })
