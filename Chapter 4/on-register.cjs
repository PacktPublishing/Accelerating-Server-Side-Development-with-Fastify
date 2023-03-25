const Fastify = require('fastify')
const fp = require('fastify-plugin')

const app = Fastify({ logger: true })
app.decorate('data', { foo: 'bar' }) // [1]
app.addHook('onRegister', (instance, options) => {
  app.log.info({ options })
  instance.data = { ...instance.data } // [2]
})
app.register(
  async function plugin1 (instance, options) {
    instance.data.plugin1 = 'hi' // [3]
    instance.log.info({ data: instance.data })
  },
  { name: 'plugin1' }
)
app.register(
  fp(async function plugin2 (instance, options) {
    instance.data.plugin2 = 'hi2' // [4]
    instance.log.info({ data: instance.data })
  }),
  { name: 'plugin2' }
)

app
  .ready()
  .then(() => {
    app.log.info('Application is ready.')
    app.log.info({ data: app.data }) // [5]
  })
  .catch(err => {
    app.log.error(err)
    process.exit()
  })
