'use strict'

const fastify = require('fastify')

const app = fastify({
  logger: true
})

app.register(async (instance, opts) => {
  instance.addSchema({
    $id: 'http://myapp.com/user.json',
    type: 'string',
    maxLength: 10
  })

  instance.get('/single-schema', () => {
    return instance.getSchema('http://myapp.com/user.json')
  })
  instance.get('/all-schemas', () => {
    return instance.getSchemas()
  })
})
app.register(async (instance, opts) => {
  instance.addSchema({
    $id: 'http://myapp.com/user.json',
    type: 'string',
    maxLength: 50
  })

  instance.get('/single-schema', () => {
    return instance.getSchema('http://myapp.com/user.json')
  })
  instance.get('/all-schemas', () => {
    return instance.getSchemas()
  })
}, { prefix: '/child' })

app.listen({ port: 8080 })
