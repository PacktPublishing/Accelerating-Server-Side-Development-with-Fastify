const fp = require('fastify-plugin')
module.exports = fp(async function (app) {
  app.decorate('posts', {
    async getAll () {
      // Call a database or something
      return [{
        id: 1,
        title: 'Hello World'
      }]
    }
  })
})
