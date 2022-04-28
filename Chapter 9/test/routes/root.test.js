'use strict'

const { test } = require('tap')
const { buildApp } = require('../helper')

test('default root route', async (t) => {
  const app = await buildApp(t)

  const res = await app.inject({
    url: '/'
  })
  t.same(JSON.parse(res.payload), { root: true })
})
