'use strict'

const registered = []

module.exports = {
  async readUser (app, email) {
    const user = await app.mongo.db.collection('users').findOne({ email })
    return user
  },

  async storeUser (app, user) {
    const newUser = await app.mongo.db.collection('users').insertOne(user)
    return newUser.insertedId
  },

  data () {
    return registered
  }
}
