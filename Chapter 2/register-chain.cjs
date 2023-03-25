const Fastify = require('fastify')

// [1]
async function plugin1 (fastify, options) {
  app.log.info('plugin1')
}
async function plugin2 (fastify, options) {
  app.log.info('plugin2')
}
async function plugin3 (fastify, options) {
  app.log.info('plugin3')
}

const app = Fastify({ logger: true })

app // [2]
  .register(plugin1)
  .register(plugin2)

app.register(plugin3) // [3]

app.ready()
  .then(() => {
    app.log.info('All plugins are now registered!')
  })
