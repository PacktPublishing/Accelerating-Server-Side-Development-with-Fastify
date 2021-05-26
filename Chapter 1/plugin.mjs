import fastify from 'fastify' // [1]: import the framework
const serverOptions = { // [2]: define some settings for the server
  logger: {
    level: 'debug'
  }
}
const app = fastify(serverOptions) // [3]: instantiate the application

app.addHook('onRoute', function parentHook(routeOptions) {
  console.log(routeOptions)
})

app.addHook('onRegister', function inspector(plugin, pluginOptions) {
  console.log('Chapter 2, Plugin System and Boot Process')
})

app.addHook('onReady', function preLoading(done) {
  console.log('onReady')
  done()
})

app.addHook('onReady', async function preLoading() {
  console.log('async onReady')
  // the done argument is gone!
})

app.addHook('onClose', function manageClose(done) {
  console.log('onClose')
  done()
})

app.setNotFoundHandler(function custom404(request, reply) {
  const payload = {
    message: 'URL not found'
  }
  reply.send(payload)
})

app.route({
  url: '/hello',
  method: 'GET',
  handler: function myHandler(request, reply) {
    reply.send('world')
  }
})

pluginInstance.addHook('onRoute', function inspector(routeOptions) {
  console.log('onRoute root called from ' + routeOptions.path) // [1]
})

app.register(async function pluginOne(pluginInstance, opts) {
  pluginInstance.addHook('onRoute', function hookA(routeOptions) {
    console.log('onRoute one called from ' + routeOptions.path) // [2]
  })
  pluginInstance.get('/one', async () => 'one')
})

app.register(async function pluginTwo(pluginInstance, opts) {
  pluginInstance.addHook('onRoute', function hookB(routeOptions) {
    console.log('onRoute two called from ' + routeOptions.path) // [3]
  })
  pluginInstance.get('/two', async () => 'two')
})

await app.listen({
  port: 8080,
  host: '0.0.0.0'
})

// [1] logs the server config
app.log.debug(app.initialConfig, 'Fastify listening with the config')
