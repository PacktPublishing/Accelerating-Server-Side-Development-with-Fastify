'use strict'

const registered = []

module.exports = {
  async store (user) {
    registered.push(user)
  },
  data () {
    return registered
  }
}
