const Fastify = require('fastify')
const { Readable } = require('stream')

const app = Fastify({ logger: true })
app.addHook('preParsing', async (request, _reply, payload) => {
  let body = ''
  for await (const chunk of payload) {
    // [1]
    body += chunk
  }
  request.log.info(JSON.parse(body)) // [2]

  const newPayload = new Readable() // [3]
  newPayload.receivedEncodedLength = parseInt(request.headers['content-length'], 10)
  newPayload.push(JSON.stringify({ changed: 'payload' }))
  newPayload.push(null)

  return newPayload
})
app.post('/', (request, _reply) => {
  request.log.info(request.body) // [4]
  return 'done'
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err)
  process.exit()
})
