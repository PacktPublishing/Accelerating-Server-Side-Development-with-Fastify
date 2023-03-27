const Fastify = require('fastify')

const app = Fastify({ logger: true })
app.decorate('data', 'mydata') // [1]
app.addHook('onReady', async function () {
  // [2]
  app.log.info(this.data)
})

app
  .ready()
  .then(() => {
    app.log.info('Application is ready.')
  })
  .catch(err => {
    app.log.error(err)
    process.exit()
  })
