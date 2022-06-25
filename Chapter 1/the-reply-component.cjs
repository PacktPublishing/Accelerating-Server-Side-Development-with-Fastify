'use strict'
const fastify = require('fastify')
const serverOptions = {
  logger: true
}
const app = fastify(serverOptions)

/* SYNC HANDLER RETURNS A CLASS */
class Car {
  constructor (model) {
    this.model = model
  }

  toJSON () {
    return {
      type: 'car',
      model: this.model
    }
  }
}
app.get('/car', function (request, reply) {
  return new Car('Ferrari')
})

/* A POST ROUTE */
const cats = []
app.post('/cat', function saveCat (request, reply) {
  cats.push(request.body)
  reply.code(201).send({ allCats: cats })
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Server is now listening on ${address}
  })
