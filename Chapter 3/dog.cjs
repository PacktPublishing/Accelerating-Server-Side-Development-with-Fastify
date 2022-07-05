'use strict'
module.exports = [
  {
    method: 'GET',
    url: '/dog',
    handler: function dog (request, reply) { reply.send('dog') }
  }
]
