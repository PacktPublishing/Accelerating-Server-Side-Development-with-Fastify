'use strict'
const fastify = require('fastify')
const qs = require('qs')

const app = fastify({
  logger: true,
  maxParamLength: 40,
  querystringParser: function newParser (queryParamString) {
    return qs.parse(queryParamString, { allowDots: true })
  },
  bodyLimit: 1024 // 1 KB
})

// Try it http://localhost:8080/ueno/pets/hachiko
app.get('/:userId/pets/:petId', function getPet (request, reply) {
  reply.send(request.params)
})

// Try it http://localhost:8080/foo/bar?param1=one&param2=two&foo.bar=42
app.get('/foo/bar', function search (request, reply) {
  reply.send(request.query)
})

app.post('/', { // [2]
  bodyLimit: 2097152 // 2 MB
}, async () => 'hello world')

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
