'use strict'
const fastify = require('fastify')
const serverOptions = {
  logger: {
    level: 'debug'
  }
}

async function start () {
  const app = fastify(serverOptions)
  await app.listen({
    port: 0,
    host: '0.0.0.0'
  })
  app.log.debug(app.initialConfig, 'Fastify listening with the config')
  app.log.info('HTTP Server port is %i', app.server.address().port)
}

start()
