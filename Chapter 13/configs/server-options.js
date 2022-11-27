'use strict'

const loggerOptions = require('./logger-options')
const crypto = require('crypto')

module.exports = {
  disableRequestLogging: true,
  logger: loggerOptions, // todo disable when instrumenting
  requestIdLogLabel: false,
  requestIdHeader: 'x-request-id',
  genReqId (req) {
    return req.headers['x-amz-request-id'] || crypto.randomUUID()
  },
  ajv: {
    customOptions: {
      coerceTypes: 'array',
      removeAdditional: 'all'
    }
  }
}
