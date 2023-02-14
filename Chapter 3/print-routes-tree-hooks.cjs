'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true,
  exposeHeadRoutes: false
})

app.register(async function pluginA (instance) {
  app.addHook('onRequest', function auth (request, reply, done) { done() })
  app.addHook('preHandler', function isFeline (request, reply, done) { done() })
  instance.get('/', handler)
  instance.get('/cats', handler)
  instance.get('/cats', { constraints: { host: 'cats.land' } }, handler)
  instance.post('/cats', handler)
  instance.put('/cats', handler)
  instance.get('/cats/:id', handler)
}, { prefix: '/feline' })

app.addHook('preHandler', function isAnimal (request, reply, done) { done() })
app.get('/', handler)
app.get('/dogs', handler)
app.post('/dogs', handler)
app.put('/dogs', handler)
app.get('/dogs/:id', handler)
app.get('/who-is-the-best', handler)

app.get('/hello', handler)
app.get('/help', handler)
app.get('/:help', handler)
app.get('/helicopter', handler)
app.get('/foo', handler)

app.ready()
  .then(function started () {
    console.log(app.printRoutes())
    console.log('---------------------------------')
    console.log(app.printRoutes({ commonPrefix: false, includeHooks: true }))
  })

async function handler () { return 'hello' }
