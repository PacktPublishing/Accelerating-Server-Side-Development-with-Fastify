'use strict'

const t = require('tap')
const fs = require('fs').promises

t.test('a test description', function testFunction (t) {
  t.plan(1)
  const myVar = 42
  t.equal(myVar, 42, 'this number is 42')
})

t.test('t.end() usage', function testFunction (t) {
  const myVar = 42
  t.equal(myVar, 42, 'this number is 42')
  t.end()
})

t.test('same object structure', function testFunction (t) {
  t.plan(1)
  const sameStructure = { hello: 'world' }
  t.same(sameStructure, { hello: 'world' }, 'the object is correct')
})

t.test('almost equals object structure', function testFunction (t) {
  t.plan(1)
  const almostLike = {
    hello: 'world',
    foo: 'bar'
  }
  t.match(almostLike, { hello: 'world' }, 'the object is similar')
})

t.test('almost equals object structure with regex', function testFunction (t) {
  t.plan(1)
  const almostLike = {
    hello: 'world',
    foo: 'bar'
  }
  t.match(almostLike, {
    hello: 'world',
    foo: /BAR/i
  }, 'the object is similar with regex')
})

t.test('sub test', function testFunction (t) {
  t.plan(2)

  const falsyValue = null
  t.notOk(falsyValue, 'it is a falsy value')

  t.test('boolean asserions', subTapTest => {
    subTapTest.plan(1)
    subTapTest.ok(true, 'true is ok')
  })
})

t.test('async test', async t => {
  const fileContent = await fs.readFile('./package.json', 'utf8')
  t.type(fileContent, 'string', 'the file content is a string')

  t.test('check main file', async subTest => {
    const json = JSON.parse(fileContent)
    subTest.match(json, { version: '1.0.0' })

    const appIndex = await fs.readFile(json.main, 'utf8')
    subTest.match(appIndex, 'use strict', 'the main file is correct')
  })

  t.pass('test completed')
})
