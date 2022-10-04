'use strict'

const SQL = require('@nearform/sql')
const DataLoader = require('dataloader')

module.exports = function buildDataLoader (app) {
  const dl = new DataLoader(async function fetcher (ids) {
    const secureIds = ids.map(id => SQL`${id}`)
    const sql = SQL`SELECT * FROM Person WHERE familyId IN (${SQL.glue(secureIds, ',')})`
    const personData = await app.sqlite.all(sql)
    return ids.map((id) => personData.filter((f) => `${f.familyId}` === `${id}`))
  }, {
    cacheKeyFn: (key) => `${key}`
  })

  return dl
}
