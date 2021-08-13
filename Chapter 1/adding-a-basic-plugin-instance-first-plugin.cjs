'use strict'
const fastify = require('fastify')
const serverOptions = {
  logger: true
}
const app = fastify(serverOptions)

/* THE FIRST PLUGIN */
app.register(function myPlugin (pluginInstance, opts, next) {
  pluginInstance.log.info('I am a plugin instance, children of app')
  next()
}, { hello: 'the opts object' })

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Server is now listening on ${address}
  })
