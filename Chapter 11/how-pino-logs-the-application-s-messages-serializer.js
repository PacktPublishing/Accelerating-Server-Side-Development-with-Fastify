'use strict'

const pino = require('pino')
const log = pino({
  serializers: {
    user: function userSerializer (value) {
      return { id: value.userId }
    }
  }
})
const userObj = { userId: 42, imageBase64: 'FOOOO...' }
log.info({ user: userObj, action: 'login' })
// {"level":30,"time":1644136926862,"user":{"id":42},"action":"login"}
