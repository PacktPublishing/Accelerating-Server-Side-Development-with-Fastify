'use strict'

const { listen } = require('fastify-cli/helper')

// const argv = ['-r', 'configs/tracing.js', '-l', 'info', '--options', 'app.js']
const argv = ['-l', 'info', '--options', 'app.js']
listen(argv)
