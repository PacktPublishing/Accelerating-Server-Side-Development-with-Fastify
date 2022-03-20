'use strict'

const pino = require('pino')
const log = pino({ level: 'debug' })
log.debug('Hello world') // [1]
// {"level":30,"time":1644055693539,"msg":"Hello world"}
log.info('Hello world from %s', 'Fastify') // [2]
// {"level":30,"time":1644055693539,"msg":"Hello world from Fastify"}
log.info({ hello: 'world' }, 'Cheers') // [3]
// {"level":30,"time":1644055693539,"hello":"world","msg":"Cheers"}
log.info({ hello: 'world' }, 'Cheers from %s', 'me') // [4]
// {"level":30,"time":1644055693539,"hello":"world","msg":"Cheers from me"}
