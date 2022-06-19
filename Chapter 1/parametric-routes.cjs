'use strict'
const fastify = require('fastify')

const app = fastify({
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty'
    }
  },
  disableRequestLogging: true,
  requestIdLogLabel: 'reqId',
  requestIdHeader: 'request-id',
  genReqId: function (httpIncomingMessage) {
    return `foo-${Math.random()}`
  }
})

const cats = []
app.post('/cat', function saveCat (request, reply) {
  cats.push(request.body)
  return { allCats: cats }
})

app.get('/cat/:catName', function readCat (request, reply) {
  const lookingFor = request.params.catName
  const result = cats.find(cat => cat.name === lookingFor)
  if (result) {
    reply.send({ cat: result })
  } else {
    reply.code(404)
    throw new Error(`cat ${lookingFor} not found`)
  }
})

// uncomment this to continue the chapter's example
// app.get('/cat/:catIndex(\\d+)', function readCat (request, reply) {
//   const lookingFor = request.params.catIndex
//   const result = cats[lookingFor]
//   if (result) {
//     return { cat: result }
//   }
//   return 'CAT NOT FOUND'
// })

app.get('/cat/*', function sendCats (request, reply) {
  reply.send({ allCats: cats })
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Server is now listening on ${address}
  })
