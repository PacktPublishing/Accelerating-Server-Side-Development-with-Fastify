module.exports = async function (app) {
  app.get('/posts', (request, reply) => {
    return app.posts.getAll()
  })
}
