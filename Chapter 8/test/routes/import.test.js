'use strict'

const fs = require('node:fs')
const path = require('node:path')

const t = require('tap')
const form = require('form-auto-content')

const { buildApp, buildUser } = require('../helper')

t.beforeEach(async (t) => {
  const app = await buildApp(t, {
    MONGO_URL: 'mongodb://localhost:27017/test-' + Date.now()
  })
  const user = await buildUser(app)
  t.context = { app, user }
})

t.test('access denied', async (t) => {
  const denied = await t.context.app.inject({
    method: 'POST',
    url: '/todos/files/import'
  })
  t.equal(denied.statusCode, 401)
})

t.test('import', async (t) => {
  const { app, user: { token } } = t.context

  const myForm = form({
    todoListFile: getImportFileStream('import-todo-list.csv')
  })

  const importResp = await app.inject({
    method: 'POST',
    url: '/todos/files/import',
    payload: myForm.payload,
    ...headers(token, myForm.headers)
  })

  t.equal(importResp.statusCode, 201)
  t.match(importResp.json(), [
    { id: /\w{24}/ },
    { id: /\w{24}/ },
    { id: /\w{24}/ },
    { id: /\w{24}/ }
  ])

  const listResp = await app.inject({
    method: 'GET',
    url: '/todos',
    ...headers(token)
  })
  t.equal(listResp.statusCode, 200)
  t.match(listResp.json().data, [
    { title: 'foo', done: false },
    { title: 'bar', done: true },
    { title: 'charlie', done: false },
    { title: 'zumba', done: true }
  ])
})

function getImportFileStream (filename) {
  return fs.createReadStream(path.join(__dirname, '..', 'fixtures', filename))
}

function headers (token, additionalHeaders) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...additionalHeaders
    }
  }
}
