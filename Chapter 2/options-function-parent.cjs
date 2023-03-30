const Fastify = require('fastify')
function options (parent) {
  return ({
    prefix: 'v1',
    myPlugin: {
      first: parent.mySpecialProp // [2]
    }
  })
}
const app = Fastify({ logger: true })
app.decorate('mySpecialProp', 'root prop') // [1]
app.register(async function myPlugin (fastify, options) {
  app.log.info(options.myPlugin.first) // 'root prop'
}, options)
app.ready()
  .then(() => {
    app.log.info('All plugins are now registered!')
  })
