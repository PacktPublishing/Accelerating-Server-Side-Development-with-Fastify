const Fastify = require('fastify')

const app = Fastify({ logger: true })

app.decorate('root', 'hello from the root instance.') // [1]
app.register(async function myPlugin (fastify, _options) {
  console.log('myPlugin -- ', fastify.root)
  fastify.decorate('myPlugin', 'hello from myPlugin.') // [2]
  console.log('myPlugin -- ', fastify.myPlugin)
})

app.ready()
  .then(() => {
    console.log('root -- ', app.root) // [3]
    console.log('root -- ', app.myPlugin)
  })
