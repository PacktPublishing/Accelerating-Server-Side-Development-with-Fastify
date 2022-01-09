'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {
    configData: {
      NODE_ENV: 'test',
      MONGO_URL: 'mongodb://localhost:27017/test'
    }
  }
}

// automatically build and tear down our instance
function build (t) {
  const serverConfig = require('../configs/server-options')
  const app = Fastify(serverConfig)

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.teardown(app.close.bind(app))

  return app
}

module.exports = {
  config,
  build
}
