'use strict'

const crypto = require('node:crypto')
const t = require('tap')
const { buildApp } = require('./helper')

t.test('cannot access protected routes without header', async (t) => {
  const app = await buildApp(t)
  const privateRoutes = [
    '/me'
  ]

  for (const url of privateRoutes) {
    const response = await app.inject({ method: 'GET', url })
    t.equal(response.statusCode, 401)
    t.same(response.json(), {
      statusCode: 401,
      code: 'FST_JWT_NO_AUTHORIZATION_IN_HEADER',
      error: 'Unauthorized',
      message: 'No Authorization was found in request.headers'
    })
  }
})

t.test('cannot access protected routes with wrong header', async (t) => {
  const app = await buildApp(t)
  const privateRoutes = [
    '/me'
  ]

  for (const url of privateRoutes) {
    const response = await app.inject({ method: 'GET', url, headers: { authorization: 'Bearer foo' } })
    t.equal(response.statusCode, 401)
    t.same(response.json(), {
      statusCode: 401,
      code: 'FST_JWT_AUTHORIZATION_TOKEN_INVALID',
      error: 'Unauthorized',
      message: 'Authorization token is invalid: The token is malformed.'
    })
  }
})

t.test('register should handle data store errors and hide the error message', async (t) => {
  mockDataStore(t, {
    async readUser () { return null },
    async storeUser () {
      throw new Error('Fail to store')
    }
  })

  const app = await buildApp(t)
  const response = await app.inject({
    method: 'POST',
    url: '/register',
    payload: {
      username: 'test',
      password: 'icanpass'
    }
  })
  t.equal(response.statusCode, 500)
  t.same(response.json(), { registered: false })
})

t.test('register the user', async (t) => {
  const randomUser = crypto.randomBytes(Math.ceil(32 / 2)).toString('hex')

  const app = await buildApp(t)
  const response = await app.inject({
    method: 'POST',
    url: '/register',
    payload: {
      username: randomUser,
      password: 'icanpass'
    }
  })
  t.equal(response.statusCode, 201)
  t.same(response.json(), { registered: true })

  t.test('wrong password login', async (t) => {
    const login = await app.inject({
      method: 'POST',
      url: '/authenticate',
      payload: {
        username: randomUser,
        password: 'wrong'
      }
    })
    t.equal(login.statusCode, 401)
    t.same(login.json(), {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Wrong credentials provided'
    })
  })

  t.test('successful login', async (t) => {
    const login = await app.inject({
      method: 'POST',
      url: '/authenticate',
      payload: {
        username: randomUser,
        password: 'icanpass'
      }
    })
    t.equal(login.statusCode, 200)
    t.match(login.json(), {
      token: /(\w*\.){2}.*/
    }, 'the token is a valid JWT')

    t.test('access protected route', async (t) => {
      const response = await app.inject({
        method: 'GET',
        url: '/me',
        headers: {
          authorization: `Bearer ${login.json().token}`
        }
      })
      t.equal(response.statusCode, 200)
      t.match(response.json(), { username: randomUser })
    })
  })
})

t.test('failed login for not existing user', async (t) => {
  const app = await buildApp(t)
  const response = await app.inject({
    method: 'POST',
    url: '/authenticate',
    payload: {
      username: crypto.randomBytes(Math.ceil(32 / 2)).toString('hex'),
      password: 'wrong'
    }
  })
  t.equal(response.statusCode, 401)
  t.same(response.json(), {
    statusCode: 401,
    error: 'Unauthorized',
    message: 'Wrong credentials provided'
  })
})

function cleanCache () {
  Object.keys(require.cache).forEach(function (key) { delete require.cache[key] })
}

function mockDataStore (t, mock) {
  const path = '../routes/data-store.js'
  cleanCache()
  require(path)
  require.cache[require.resolve(path)].exports = mock
  t.teardown(cleanCache)
}
