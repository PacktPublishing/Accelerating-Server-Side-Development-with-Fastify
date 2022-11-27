'use strict'

const t = require('tap')
const dockerHelper = require('./helper-docker')

const docker = dockerHelper()
const { Containers } = dockerHelper

t.teardown(async () => {
  if (process.env.CI) {
    return
  }
  await docker.stopContainer(Containers.mongo)
})
