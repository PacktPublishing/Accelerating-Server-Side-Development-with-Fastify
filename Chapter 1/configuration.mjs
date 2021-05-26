import fastify from 'fastify'

const environment = process.env.NODE_ENV // [1]
const config = await staticConfigLoader(environment) // [2]
const app = fastify(config.serverOptions.factory)
app.register(plugin, config.pluginOptions.fooBar)
app.register(plugin, { // [3]
  bar: function () {
    return config.pluginOptions ? 42 : -42
  }
})
await app.listen(config.serverOptions.listen)

async function staticConfigLoader(env) {
  return { // [4]
    serverOptions: getServerConfig(),
    pluginOptions: {},
    applicationOptions: {}
  }
}

function plugin(instance, opts, next) {
  console.log(`Read options %o`, opts)
  next()
}

function getServerConfig() {
  return {
    factory: {
      logger: true
    },
    listen: {
      port: 8080,
      host: '0.0.0.0'
    }
  }
}
