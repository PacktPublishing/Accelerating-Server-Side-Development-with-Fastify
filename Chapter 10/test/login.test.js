'use strict'

const t = require('tap')
const { buildApp } = require('./helper')

t.test('cannot access protected routes', async (t) => {
  const app = await buildApp(t)
  const privateRoutes = [
    // '/',
    '/me'
  ]

  for (const url of privateRoutes) {
    const response = await app.inject({ method: 'GET', url })
    t.equal(response.statusCode, 401)
    t.same(response.json(), {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'No Authorization was found in request.headers'
    })
  }
})

function cleanCache () {
  Object.keys(require.cache).forEach(function (key) { delete require.cache[key] })
}

t.test('register error', async (t) => {
  const path = '../routes/data-store.js'
  cleanCache()
  require(path)
  require.cache[require.resolve(path)].exports = {
    async store () {
      throw new Error('Fail to store')
    }
  }
  t.teardown(cleanCache)

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
  const app = await buildApp(t)
  const response = await app.inject({
    method: 'POST',
    url: '/register',
    payload: {
      username: 'test',
      password: 'icanpass'
    }
  })
  t.equal(response.statusCode, 201)
  t.same(response.json(), { registered: true })
})

t.test('failed login', async (t) => {
  const app = await buildApp(t)
  const response = await app.inject({
    method: 'POST',
    url: '/authenticate',
    payload: {
      username: 'test',
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

t.test('successful login', async (t) => {
  const app = await buildApp(t)
  const login = await app.inject({
    method: 'POST',
    url: '/authenticate',
    payload: {
      username: 'test',
      password: 'icanpass'
    }
  })
  t.equal(login.statusCode, 200)
  t.match(login.json(), {
    token: /(\w*\.){2}.*/
  })

  t.test('access protected route', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/me',
      headers: {
        authorization: `Bearer ${login.json().token}`
      }
    })
    t.equal(response.statusCode, 200)
    t.match(response.json(), { username: 'John Doe', email: 'doe@email.com' })
  })
})
