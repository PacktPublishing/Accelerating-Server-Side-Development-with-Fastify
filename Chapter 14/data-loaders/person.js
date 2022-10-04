'use strict'

const SQL = require('@nearform/sql')
const DataLoader = require('dataloader')

module.exports = function buildDataLoader (app) {
  const dl = new DataLoader(async function fetcher (ids) {
    const secureIds = ids.map(id => SQL`${id}`)
    const sql = SQL`SELECT * FROM Person WHERE id IN (${SQL.glue(secureIds, ',')})`
    const personData = await app.sqlite.all(sql)
    return ids.map((id) => personData.find((f) => `${f.id}` === `${id}`))
  }, {
    cacheKeyFn: (key) => `${key}`
  })

  return dl
}
