'use strict'

const t = require('tap')
const { buildApp, buildUser } = require('../helper')

t.beforeEach(async (t) => {
  const app = await buildApp(t, {
    MONGO_URL: 'mongodb://localhost:27017/test-' + Date.now()
  })
  const user = await buildUser(app)
  t.context = { app, user }
})

t.test('access denied', async (t) => {
  const denied = await t.context.app.inject({ url: '/todos' })
  t.equal(denied.statusCode, 401)
})

t.test('check empty todo list', async (t) => {
  const { token } = t.context.user

  const list = await t.context.app.inject({ url: '/todos', ...headers(token) })
  t.equal(list.statusCode, 200)
  t.same(list.json(), {
    data: [],
    totalCount: 0
  })
})

t.test('user isolation', async (t) => {
  const { app } = t.context

  const userOne = await t.context.user
  const userTwo = await buildUser(app)

  await app.inject({
    url: '/todos',
    method: 'POST',
    payload: { title: 'user one' },
    ...headers(userOne.token)
  })

  await app.inject({
    url: '/todos',
    method: 'POST',
    payload: { title: 'user two' },
    ...headers(userTwo.token)
  })

  {
    const list = await app.inject({ url: '/todos', ...headers(userOne.token) })
    t.equal(list.statusCode, 200)
    t.match(list.json(), {
      data: [{ title: 'user one' }],
      totalCount: 1
    })
  }

  {
    const list = await app.inject({ url: '/todos', ...headers(userTwo.token) })
    t.equal(list.statusCode, 200)
    t.match(list.json(), {
      data: [{ title: 'user two' }],
      totalCount: 1
    })
  }
})

t.test('create a todo item', async (t) => {
  const { app } = t.context
  const { token } = t.context.user

  const create = await app.inject({
    url: '/todos',
    method: 'POST',
    payload: { title: 'hello world' },
    ...headers(token)
  })
  t.equal(create.statusCode, 201)
  t.match(create.json(), { id: /\w{24}/ })

  const list = await app.inject({ url: '/todos/', ...headers(token) })
  t.equal(list.statusCode, 200)
  t.match(list.json(), {
    data: [
      {
        id: /\w{24}/,
        title: 'hello world',
        done: false
      }
    ],
    totalCount: 1
  })
})

t.test('get todo item', async (t) => {
  const { app } = t.context
  const { token } = t.context.user

  const noItem = await app.inject({
    url: `/todos/${'a'.repeat(24)}`,
    ...headers(token)
  })
  t.equal(noItem.statusCode, 404, 'no item')

  const create = await app.inject({
    url: '/todos',
    method: 'POST',
    payload: { title: 'hello world' },
    ...headers(token)
  })
  t.equal(create.statusCode, 201)

  const item = await app.inject({
    url: `/todos/${create.json().id}`,
    ...headers(token)
  })

  t.equal(item.statusCode, 200)
  t.match(item.json(), {
    id: create.json().id,
    title: 'hello world',
    done: false
  })
})

t.test('search todo items with pagination', async (t) => {
  const { app } = t.context
  const { token } = t.context.user

  const todos = ['hello world', 'hello world 2', 'hello world foo 3']
  for (const title of todos) {
    const create = await app.inject({
      url: '/todos',
      method: 'POST',
      payload: { title },
      ...headers(token)
    })
    t.equal(create.statusCode, 201, `created "${title}" item`)
  }

  const items = await app.inject({
    url: '/todos/',
    ...headers(token)
  })
  t.equal(items.statusCode, 200)
  t.equal(items.json().totalCount, todos.length)

  const filter = await app.inject({
    url: '/todos/',
    query: { title: 'foo' },
    ...headers(token)
  })
  t.equal(filter.statusCode, 200)
  t.equal(filter.json().data.length, 1)

  const pagination = await app.inject({
    url: '/todos/',
    query: { skip: 1, limit: 1 },
    ...headers(token)
  })

  t.equal(pagination.statusCode, 200)
  t.equal(filter.json().data.length, 1)
  t.equal(pagination.json().data[0].title, 'hello world 2')

  const wrongPagination = await app.inject({
    url: '/todos/',
    query: { skip: 100, limit: 100 },
    ...headers(token)
  })

  t.equal(wrongPagination.statusCode, 200)
  t.equal(wrongPagination.json().data.length, 0)
})

t.test('do a todo item', async (t) => {
  const { app } = t.context
  const { token } = t.context.user

  const noItem = await app.inject({
    method: 'PUT',
    url: `/todos/${'a'.repeat(24)}`,
    payload: { done: true },
    ...headers(token)
  })
  t.equal(noItem.statusCode, 404, 'no item')

  const create = await app.inject({
    url: '/todos',
    method: 'POST',
    payload: { title: 'hello world' },
    ...headers(token)
  })
  t.equal(create.statusCode, 201)

  const edit = await app.inject({
    method: 'PUT',
    url: `/todos/${create.json().id}`,
    payload: { title: 'hello world 2', done: true },
    ...headers(token)
  })
  t.equal(edit.statusCode, 204)

  const item = await app.inject({
    url: `/todos/${create.json().id}`,
    ...headers(token)
  })
  t.equal(item.statusCode, 200)
  t.match(item.json(), {
    id: create.json().id,
    title: 'hello world 2',
    done: true
  })
})

t.test('delete a todo item', async (t) => {
  const { app } = t.context
  const { token } = t.context.user

  const noItem = await app.inject({
    method: 'DELETE',
    url: `/todos/${'a'.repeat(24)}`,
    ...headers(token)
  })
  t.equal(noItem.statusCode, 404)

  const create = await app.inject({
    url: '/todos',
    method: 'POST',
    payload: { title: 'hello world' },
    ...headers(token)
  })
  t.equal(create.statusCode, 201)

  const edit = await app.inject({
    method: 'DELETE',
    url: `/todos/${create.json().id}`,
    ...headers(token)
  })
  t.equal(edit.statusCode, 204)

  const item = await app.inject({
    url: `/todos/${create.json().id}`,
    ...headers(token)
  })
  t.equal(item.statusCode, 404)
})

t.test('do a todo item unsing the status', async (t) => {
  const { app } = t.context
  const { token } = t.context.user

  const noItem = await app.inject({
    method: 'POST',
    url: `/todos/${'a'.repeat(24)}/done`,
    ...headers(token)
  })
  t.equal(noItem.statusCode, 404, 'no item')

  const create = await app.inject({
    url: '/todos',
    method: 'POST',
    payload: { title: 'hello world' },
    ...headers(token)
  })
  t.equal(create.statusCode, 201)

  {
    const edit = await app.inject({
      method: 'POST',
      url: `/todos/${create.json().id}/done`,
      ...headers(token)
    })
    t.equal(edit.statusCode, 204)

    const item = await app.inject({
      url: `/todos/${create.json().id}`,
      ...headers(token)
    })
    t.equal(item.statusCode, 200)
    t.match(item.json(), {
      id: create.json().id,
      title: 'hello world',
      done: true
    })
  }

  {
    const edit = await app.inject({
      method: 'POST',
      url: `/todos/${create.json().id}/undone`,
      ...headers(token)
    })
    t.equal(edit.statusCode, 204)

    const item = await app.inject({
      url: `/todos/${create.json().id}`,
      ...headers(token)
    })
    t.equal(item.statusCode, 200)
    t.match(item.json(), {
      id: create.json().id,
      title: 'hello world',
      done: false
    })
  }
})

function headers (token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}
