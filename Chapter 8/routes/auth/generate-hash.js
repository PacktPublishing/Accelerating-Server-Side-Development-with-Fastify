'use strict'

const crypto = require('node:crypto')
const util = require('node:util')

const pbkdf2 = util.promisify(crypto.pbkdf2)

module.exports = async function generateHash (password, salt) {
  if (!salt) {
    // Generate a random salt value
    salt = crypto.randomBytes(16).toString('hex')
  }

  // Hash the password using the salt value and SHA-256 algorithm
  const hash = (await pbkdf2(password, salt, 1000, 64, 'sha256')).toString('hex')
  return { salt, hash }
}
