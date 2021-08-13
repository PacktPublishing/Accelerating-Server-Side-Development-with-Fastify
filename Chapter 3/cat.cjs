'use strict'
module.exports = [
  {
    method: 'POST',
    url: '/cat',
    handler: function cat (request, reply) { reply.send('cat') }
  }
]
