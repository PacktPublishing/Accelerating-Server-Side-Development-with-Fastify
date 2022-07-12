'use strict'

const fastify = require('fastify')
const Joi = require('joi')

const app = fastify({
  logger: true
})

app.register(async function plugin (instance, opts) {
  function joiCompiler ({ schema, method, url, httpPart }) {
    return function (data) { return schema.validate(data) }
  }
  instance.setValidatorCompiler(joiCompiler)
  instance.post('/joi', {
    handler: echo,
    schema: {
      body: Joi.object({
        hello: Joi.string().required()
      })
    }
  })
})

app.listen({ port: 8080 })

async function echo (request, reply) {
  return {
    params: request.params,
    body: request.body,
    query: request.query,
    headers: request.headers
  }
}
