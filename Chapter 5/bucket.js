'use strict'

const fastify = require('fastify')

const app = fastify({
  logger: true
})

app.register(async (instance, opts) => {
  instance.addSchema({
    $id: 'http://myapp.com/user.json',
    type: 'string',
    maxLength: 50
  })
})
app.register(async (instance, opts) => {
  instance.addSchema({
    $id: 'http://myapp.com/user.json',
    type: 'string',
    maxLength: 50
  })

  const json = instance.getSchema('http://myapp.com/user.json')
  const jsonIdSchemaPair = instance.getSchemas()

  console.log({
    json,
    jsonIdSchemaPair
  })
})

app.listen(8080)
