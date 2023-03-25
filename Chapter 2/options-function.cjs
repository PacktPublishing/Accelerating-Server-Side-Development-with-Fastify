const Fastify = require('fastify')
const app = Fastify({ logger: true })

app.register(async function myPlugin (fastify, options) {
  app.log.info(options.myPlugin.first) // option
}, function options (parent) { // [1]
  return ({
    prefix: 'v1',
    myPlugin: {
      first: 'option'
    }
  })
})

app.ready()
  .then(() => {
    app.log.info('All plugins are now registered!')
  })
