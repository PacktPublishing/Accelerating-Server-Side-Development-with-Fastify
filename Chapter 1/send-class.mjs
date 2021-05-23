import fastify from 'fastify'
const serverOptions = {
  logger: true // turn on the default logging
}
const app = fastify(serverOptions)

class Car {
  constructor(model) {
    this.model = model
  }

  toJSON() {
    return {
      type: 'car',
      model: this.model
    }
  }
}

app.get('/car', function (request, reply) {
  reply.send(new Car('Ferrari'))
})

await app.listen({
  port: 8080,
  host: '0.0.0.0'
})
