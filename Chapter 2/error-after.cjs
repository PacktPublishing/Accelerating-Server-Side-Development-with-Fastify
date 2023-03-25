const Fastify = require('fastify')

// [1]
async function plugin1 (fastify, options) {
  throw new Error('Kaboom!')
}

const app = Fastify({ logger: true })

app
  .register(plugin1)
  .after(err => {
    if (err) { // [2]
      console.log(
        `There was an error loading plugin1: '${err.message}'. Skipping.`
      )
    }
  })

app.ready()
  .then(() => {
    console.log('app ready')
  })
