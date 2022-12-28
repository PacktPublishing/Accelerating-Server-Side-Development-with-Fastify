const { test } = require('tap')

const familyQuery = `
query search($id: ID!) {
  family(id: $id) {
    name
    members {
      fullName
      nickName
      friends { fullName }
    }
  }
}
`

;[
  ['app without dataloaders', require('./app-without-dataloaders.js')],
  ['app with dataloaders', require('./app.js')],
  ['app with errors', require('./app-errors.js')]
].forEach(([testName, build]) => {
  test(testName, async t => {
    async function doQuery (t, query, variables) {
      const app = await build()
      t.teardown(app.close.bind(app))

      const response = await app.inject({
        method: 'POST',
        url: '/graphql',
        payload: { query, variables }
      })
      t.equal(response.statusCode, 200)

      return response
    }

    test('query family', async t => {
      const response = await doQuery(t, familyQuery, { id: 1 })

      t.same(response.json(), {
        data: {
          family: {
            name: 'Foo',
            members: [
              {
                fullName: 'John Foo',
                nickName: null,
                friends: [{ fullName: 'Sara Bar' }, { fullName: 'Brian Baz' }, { fullName: 'Brown Baz' }]
              },
              {
                fullName: 'Jakie Foo',
                nickName: null,
                friends: [{ fullName: 'Micky Bar' }, { fullName: 'Sara Bar' }]
              },
              {
                fullName: 'Jessie Foo',
                nickName: 'Jess',
                friends: []
              }]
          }
        }
      })

      t.end()
    })

    test('mutation changeNickName', async t => {
      const query = `
  mutation change($id: ID!, $nickName: String!) {
    changeNickName(personId: $id, nickName: $nickName) { fullName nickName }
  }
  `

      const response = await doQuery(t, query, { id: 3, nickName: 'New' })
      t.same(response.json(), { data: { changeNickName: { fullName: 'Jessie Foo', nickName: 'New' } } })
      t.end()
    })

    test('mutation changeNickNameWithInput', async t => {
      const query = `
  mutation change($nickName: NewNickName!) {
    changeNickNameWithInput(input: $nickName) { fullName nickName }
  }
  `

      const response = await doQuery(t, query, { nickName: { personId: 3, nick: 'New' } })
      t.same(response.json(), { data: { changeNickNameWithInput: { fullName: 'Jessie Foo', nickName: 'New' } } })
      t.end()
    })
  })
})
