const Fastify = require('fastify')
const app = Fastify({ logger: true })

app.register(async function myPlugin (fastify, options) {
  console.log(options.myPlugin.first)
}, {
  prefix: 'v1',
  myPlugin: {
    first: 'custom option'
  }
})

app.ready()
  .then(() => {
    app.log.info('All plugins are now registered!')
  })
