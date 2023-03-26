const Fastify = require('fastify')
const myPlugin = require('./fp-myplugin.cjs')

const app = Fastify({ logger: true })
app.register(myPlugin)

app.ready()
  .then(() => {
    console.log('root -- ', app.root)
    console.log('root -- ', app.myPlugin)
  })
