'use strict'

const t = require('tap')
const { buildApp } = require('./helper')

t.test('logger must redact sensible data', { todo: 'fails https://github.com/backend-cafe/fastify-todo-list-api/pull/7' }, async (t) => {
  const logs = []
  const write = process.stdout.write.bind(process.stdout)
  process.stdout.write = function (chunk) {
    logs.push(chunk)
  }

  const app = await buildApp(t, { LOG_LEVEL: 'info' })
  await app.inject({
    method: 'POST',
    url: '/login',
    payload: { username: 'test', password: 'icanpass' }
  })
  process.stdout.write = write // restore the original function

  t.equal(logs.length, 2)
  const requestLog = JSON.parse(logs[0])
  t.notOk(requestLog.req.body, 'the request does not log the body')

  const responseLog = JSON.parse(logs[1])
  t.equal(responseLog.req.body.password, '***', 'field redacted')
})
