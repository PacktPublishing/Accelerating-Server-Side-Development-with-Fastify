'use strict'

const { fastify } = require('fastify')
const app = fastify({
  disableRequestLogging: true,
  requestIdLogLabel: false,
  requestIdHeader: 'x-request-id',
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    timestamp: () => {
      const dateString = new Date(Date.now()).toISOString()
      return `,"@timestamp":"${dateString}"`
    },
    redact: {
      censor: '***',
      paths: [
        'req.headers.authorization',
        'req.body.password',
        'req.body.email'
      ]
    },
    serializers: {
      req: function (request) {
        const shouldLogBody = request.context.config.logBody === true
        return {
          method: request.method,
          url: request.raw.url,
          routeUrl: request.routerPath,
          version: request.headers?.['accept-version'],
          user: request.user?.id,
          headers: request.headers,
          body: shouldLogBody ? request.body : undefined,
          hostname: request.hostname,
          remoteAddress: request.ip,
          remotePort: request.socket?.remotePort
        }
      },
      res: function (reply) {
        return {
          statusCode: reply.statusCode,
          responseTime: reply.getResponseTime()
        }
      }
    }
  }
})

app.addHook('onRequest', async function onRequestLogHook (req) {
  req.log.info({ req }, 'incoming request 🔮')
})

app.addHook('onSend', async function onSendRequestLogHook (req, res) {
  req.log.info({ req, res }, 'request completed 🎉')
})

app.get('/root', helloHandler)

async function helloHandler (request, reply) {
  // const hello = ['hello', 'world']
  // request.log.debug({ hello })
  return { hello: 'world' }
}

app.inject('/root')

// {"level":30,"time":1644154026496,"pid":94226,"hostname":"MSpigolon-ITMAC21","reqId":"req-1","req":{"method":"GET","url":"/root","hostname":"localhost:80","remoteAddress":"127.0.0.1"},"msg":"incoming request"}
