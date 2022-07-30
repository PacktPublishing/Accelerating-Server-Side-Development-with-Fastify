'use strict'

// This file contains code that we reuse
// between our tests.
const fcli = require('fastify-cli/helper')

const startArgs = '-l silent --options app.js'

const defaultEnv = {
  NODE_ENV: 'test',
  MONGO_URL: 'mongodb://localhost:27017/test',
  JWT_SECRET: 'secret-1234567890'
}

// Fill in this config with all the configurations
// needed for testing the application
function config (env) {
  return {
    configData: env
  }
}

// automatically build and tear down our instance
async function buildApp (t, env) {
  const app = await fcli.build(startArgs, config({ ...defaultEnv, ...env }))
  t.teardown(() => { app.close() })
  return app
}

module.exports = {
  buildApp
}
