'use strict'

module.exports = {
  async readUser (app, username) {
    const user = await app.mongo.db.collection('users').findOne({ username })
    return user
  },

  async storeUser (app, user) {
    const newUser = await app.mongo.db.collection('users').insertOne(user)
    return newUser.insertedId
  }
}
