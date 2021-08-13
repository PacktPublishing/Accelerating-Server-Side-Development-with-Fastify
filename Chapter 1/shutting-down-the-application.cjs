'use strict'
const fastify = require('fastify')
const serverOptions = {
  logger: true
}
const app = fastify(serverOptions)

app.addHook('onClose', (instance, done) => {
  instance.log.info('onClose hook takes 3 seconds to complete')
  setTimeout(done, 3000)
})

process.once('SIGINT', function closeApplication () {
  app.close(function closeComplete (err) {
    if (err) {
      app.log.error(err, 'error turning off')
    } else {
      app.log.info('bye bye')
    }
  })
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Server is now listening on ${address}
  })
