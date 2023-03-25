const Fastify = require('fastify')
const myPlugin = require('./fp-myplugin.cjs')

const app = Fastify({ logger: true })
app.decorate('root', 'hello from the root instance.') // [1]
app.register(myPlugin) // [2]

app.ready()
  .then(() => {
    console.log('root -- ', app.root)
    console.log('root -- ', app.myPlugin) // [3]
  })
