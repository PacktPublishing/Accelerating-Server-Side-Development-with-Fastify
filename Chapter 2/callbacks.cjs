const Fastify = require('fastify')
const app = Fastify({ logger: true })

app.register(function noError (fastify, opts, done) {
  app.log.info('Registering my first plugin.')
  // we need to call done explicitly to let fastify go to the next plugin
  done() // [1]
})
app.register(function (fastify, opts, done) {
  app.log.info('Registering my second plugin.')
  try {
    throw new Error('Something bad happened!')
    // eslint-disable-next-line no-unreachable
    done() // [2]
  } catch (err) {
    done(err) // [3]
  }
})

app.ready()
  .then(() => {
    app.log.info('All plugins are now registered!')
  })
