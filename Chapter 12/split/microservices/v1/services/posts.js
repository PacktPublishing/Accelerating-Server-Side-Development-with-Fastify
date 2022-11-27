const fp = require('fastify-plugin')
const undici = require('undici')

module.exports = fp(async function (app, opts) {
  const { v2URL } = opts
  const pool = new undici.Pool(v2URL)
  app.decorate('posts', {
    async getAll ({ reqId }) {
      const { body } = await pool.request({
        path: '/posts',
        method: 'GET',
        headers: {
          'x-request-id': reqId
        }
      })
      const data = await body.json()
      return data.posts
    }
  })

  app.addHook('onClose', async () => {
    await pool.close()
  })
})
