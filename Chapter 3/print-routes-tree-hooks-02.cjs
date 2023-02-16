'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true,
  exposeHeadRoutes: false
})
app.addHook('preHandler', async function isAnimal () { })
app.get('/dogs', handler)
app.register(async function pluginA (instance) {
  instance.addHook('onRequest', async function isCute () { })
  instance.addHook('preHandler', async function isFeline () { })
  instance.get('/cats', {
    onRequest: async function hasClaw () { } // [1]
  }, handler)
})

app.ready()
  .then(function started () {
    console.log(app.printRoutes())
    console.log('---------------------------------')
    console.log(app.printRoutes({ commonPrefix: false, includeHooks: true }))
  })

async function handler () { return 'hello' }
