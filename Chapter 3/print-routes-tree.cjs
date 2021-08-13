'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

app.register(async function pluginA (instance) {
  instance.register(async function pluginB (instance) {
    instance.register(function pluginC (instance, opts, next) {
      setTimeout(next, 1000)
    })
  })
})
app.register(async function pluginX () {})

app.ready()
  .then(function started () {
    console.log(app.printPlugins()) // [1]
    console.log(app.printRoutes({ commonPrefix: false })) // [2]
  })
