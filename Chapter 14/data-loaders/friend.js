'use strict'

const SQL = require('@nearform/sql')
const DataLoader = require('dataloader')

module.exports = function buildDataLoader (app) {
  const dl = new DataLoader(async function fetcher (ids) {
    const secureIds = ids.map(id => SQL`${id}`)
    const sql = SQL`SELECT * FROM Friend WHERE personId IN (${SQL.glue(secureIds, ',')})`
    const friendData = await app.sqlite.all(sql)
    return ids.map((id) => friendData.filter((f) => `${f.personId}` === `${id}`))
  }, {
    cacheKeyFn: (key) => `${key}`
  })

  return dl
}
