const Fastify = require('fastify')
const usersRouter = require('./users-router.cjs')

const app = Fastify()
app.decorate('users', [ // [1]
  {
    name: 'Sam',
    age: 23
  },
  {
    name: 'Daphne',
    age: 21
  }
])

app.register(usersRouter, { prefix: 'v1' }) // [2]
app.register(
  async function usersRouterV2 (fastify, options) { // [3]
    fastify.register(usersRouter) // [4]
    fastify.delete('/users/:name', (request, reply) => { // [5]
      const userIndex = fastify.users.findIndex(
        user => user.name === request.params.name
      )
      fastify.users.splice(userIndex, 1)
      reply.send()
    })
  },
  { prefix: 'v2' }
)

app.ready()
  .then(() => { console.log(app.printRoutes()) }) // [6]
