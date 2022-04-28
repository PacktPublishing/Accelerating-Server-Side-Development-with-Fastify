'use strict'

const t = require('tap')
const dockerHelper = require('./helper-docker')

const docker = dockerHelper()
const { Containers } = dockerHelper

t.teardown(async () => {
  await docker.stopContainer(Containers.mongo)
})
