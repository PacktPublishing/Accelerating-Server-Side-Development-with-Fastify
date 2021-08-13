'use strict'
const fastify = require('fastify')
const app = fastify({
  logger: true
})

const catRoutes = require('./cat.cjs')
const dogRoutes = require('./dog.cjs')

catRoutes.forEach(loadRoute)
dogRoutes.forEach(loadRoute)

function loadRoute (routeOptions) {
  app.route(routeOptions)
}

app.listen({
  port: 8080,
  host: '0.0.0.0'
})
  .then((address) => {
    // Started
  })
