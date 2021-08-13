'use strict'
const fastify = require('fastify')
const serverOptions = {
  logger: true
}
const app = fastify(serverOptions)

/* MULTIPLE PLUGINS */
app.addHook('onRoute', buildHook('root')) // [1]
app.register(async function pluginOne (pluginInstance, opts) {
  pluginInstance.addHook('onRoute', buildHook('pluginOne')) // [2]
  pluginInstance.get('/one', async () => 'one')
})
app.register(async function pluginTwo (pluginInstance, opts) {
  pluginInstance.addHook('onRoute', buildHook('pluginTwo')) // [3]
  pluginInstance.get('/two', async () => 'two')
  pluginInstance.register(async function pluginThree (subPlugin, opts) {
    subPlugin.addHook('onRoute', buildHook('pluginThree')) // [4]
    subPlugin.get('/threee', async () => 'three')
  })
})
function buildHook (id) {
  return function hook (routeOptions) {
    console.log(`onRoute ${id} called from ${routeOptions.path}`)
  }
}

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Server is now listening on ${address}
  })
