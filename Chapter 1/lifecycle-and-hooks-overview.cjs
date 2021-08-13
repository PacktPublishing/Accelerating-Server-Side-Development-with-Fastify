'use strict'
const fastify = require('fastify') // [1]
const serverOptions = { // [2]
  logger: true
}
const app = fastify(serverOptions) // [3]

app.addHook('onRoute', function inspector (routeOptions) {
  console.log(routeOptions)
})
app.addHook('onRegister', function inspector (plugin, pluginOptions) {
  console.log('Chapter 2, Plugin System and Boot Process')
})
app.addHook('onReady', function preLoading (done) {
  console.log('onReady')
  done()
})
app.addHook('onReady', async function preLoading () {
  console.log('async onReady')
  // the done argument is gone!
})
app.addHook('onClose', function manageClose (done) {
  console.log('onClose')
  done()
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => { // [4]
    // Server is now listening on ${address}
  })
