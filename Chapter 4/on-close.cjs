const Fastify = require('fastify')

const app = Fastify({ logger: true })
app.addHook('onClose', async (instance) => {
  // [1]
  instance.log.info('onClose hook triggered!')
})

app
  .ready()
  .then(async () => {
    app.log.info('Application is ready.')
    await app.close() // [2]
  })
  .catch(err => {
    app.log.error(err)
    process.exit()
  })
