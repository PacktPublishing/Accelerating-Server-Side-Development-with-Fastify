'use strict'

const crypto = require('node:crypto')

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
async function buildApp (t, env, serverOptions) {
  const app = await fcli.build(startArgs,
    config({ ...defaultEnv, ...env }),
    serverOptions
  )
  t.teardown(() => { app.close() })
  return app
}

async function buildUser (app) {
  const randomUser = crypto.randomBytes(16).toString('hex')
  const password = 'icanpass'

  await app.inject({
    method: 'POST',
    url: '/register',
    payload: {
      username: randomUser,
      password
    }
  })

  const login = await app.inject({
    method: 'POST',
    url: '/authenticate',
    payload: {
      username: randomUser,
      password
    }
  })

  return {
    username: randomUser,
    password,
    token: login.json().token
  }
}

module.exports = {
  buildApp,
  buildUser
}
