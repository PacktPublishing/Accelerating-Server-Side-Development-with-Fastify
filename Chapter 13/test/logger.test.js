'use strict'

const t = require('tap')
const split = require('split2')

const { buildApp } = require('./helper')

t.test('logger must redact sensible data', async (t) => {
  t.plan(2)
  const stream = split(JSON.parse)

  const app = await buildApp(t,
    { LOG_LEVEL: 'info' },
    {
      logger: {
        stream
      }
    }
  )
  t.teardown(() => { app.close() })

  await app.inject({
    method: 'POST',
    url: '/login',
    payload: { username: 'test', password: 'icanpass' }
  })

  for await (const line of stream) {
    if (line.msg === 'request completed 🎉') {
      t.ok(line.req.body, 'the request does log the body')
      t.equal(line.req.body.password, '***', 'field redacted')
      break
    }
  }
})
