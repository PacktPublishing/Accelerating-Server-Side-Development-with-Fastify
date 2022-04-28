'use strict'

const t = require('tap')
const dockerHelper = require('./helper-docker')

const docker = dockerHelper()
const { Containers } = dockerHelper

t.before(async function before () {
  await docker.startContainer(Containers.mongo)
})
