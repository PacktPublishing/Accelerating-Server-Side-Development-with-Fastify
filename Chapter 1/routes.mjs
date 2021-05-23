import fastify from 'fastify'
import fs from 'fs/promises'

const serverOptions = {
  logger: true
}
const app = fastify(serverOptions)

app.get('/hello', async function myHandler(request, reply) {
  return 'hello' // simple returns of a payload
})

// *** //

function business(request, reply) {
  // `this` is the Fastify application instance
  reply.send({ helloFrom: this.server.address() })
}
app.get('/server', business)

// *** //

app.get('/multi', function multi(request, reply) {
  reply.send('one')
  reply.send('two') // doesn't work and it
  reply.send('three') // logs a warning
  this.log.info('this line is executed')
})

// *** //

async function one (request, reply) {
  return { one: 1 }
}
async function two (request, reply) {
  const oneResponse = await one(request, reply)
  return {
    one: oneResponse,
    two: 2
  }
}
app.get('/', two) // contracted syntax!

// *** //

app.get('/file', function promiseHandler(request, reply) {
  // returns a promise that will return a payload
  const fileName = './package.json'
  const readPromise = fs.readFile(fileName, { encoding: 'utf8' })
  return readPromise.then(content => {
    return { // the response payload
      file: fileName,
      content
    }
  })
})

await app.listen({
  port: 8080,
  host: '0.0.0.0'
})
