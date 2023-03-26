module.exports = async function usersRouter (fastify, _) {
  fastify.register(
    async function routes (child, _options) { // [1]
      child.get('/', async (_request, reply) => {
        reply.send(child.users)
      })
      child.post('/', async (request, reply) => { // [2]
        const newUser = request.body
        child.users.push(newUser)
        reply.send(newUser)
      })
    },
    { prefix: 'users' } // [3]
  )
}
