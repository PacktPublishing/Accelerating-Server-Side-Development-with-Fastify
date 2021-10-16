'use strict'

module.exports = async function (fastify, opts) {
  console.log('example route 00000000000000000000000000000000000')
  fastify.get('/',
    {
      // schema: {
      //   properties: { $ref: 'schema:user-input' },
      //   headers: { $ref: 'schema:user-output' }
      // }
    }
    ,

    async function (request, reply) {
      return 'this is an example'
    })
}
