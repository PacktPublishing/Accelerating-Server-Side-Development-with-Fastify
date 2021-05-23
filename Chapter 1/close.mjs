import fastify from 'fastify' // [1]: import the framework
const serverOptions = { // [2]: define some settings for the server
  logger: true // turn on the default logging
}
const app = fastify(serverOptions) // [3]: instantiate the application

process.once('SIGINT', function closeApplication() {
  app.close(function closeComplete(err) {
    if (err) {
      server.log.error(err, 'error turning off')
    } else {
      server.log.info('bye bye')
    }
  })
})

await app.listen({ // [4]: start the server
  port: 8080,
  host: '0.0.0.0'
})
