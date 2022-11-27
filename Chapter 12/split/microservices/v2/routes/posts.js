module.exports = async function (app) {
  app.get('/posts', async (request, reply) => {
    return {
      posts: await app.posts.getAll()
    }
  })
}
