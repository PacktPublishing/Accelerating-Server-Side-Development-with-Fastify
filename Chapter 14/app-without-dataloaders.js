'use strict'

const Fastify = require('fastify')
const mercurius = require('mercurius')
const SQL = require('@nearform/sql')
const gqlSchema = require('./gql-schema')

run()

async function run () {
  const app = Fastify({ logger: { level: 'trace' } })
  await app.register(require('fastify-sqlite'), {
    verbose: true,
    promiseApi: true
  })

  await app.sqlite.migrate({
    migrationsPath: 'migrations/'
  })

  const resolvers = {
    Query: {
      family: async function familyFunc (parent, args, context, info) {
        const sql = SQL`SELECT * FROM family WHERE id = ${args.id}`
        const familyData = await context.app.sqlite.get(sql)
        context.reply.log.debug({ familyData }, 'Read familyData')
        return familyData
      }
    },
    Mutation: {
      changeNickName: async function changeNickNameFunc (parent, args, context, info) {
        const sql = SQL`UPDATE person SET nickName = ${args.nickName} WHERE id = ${args.personId}`
        const { changes } = await context.app.sqlite.run(sql)
        if (changes === 0) {
          throw new Error(`Person id ${args.personId} not found`)
        }
        const person = await context.personDL.load(args.personId)
        context.reply.log.debug({ person }, 'Read updated person')
        return person
      },
      changeNickNameWithInput: async function changeNickNameFunc (parent, { input }, context, info) {
        const sql = SQL`UPDATE person SET nickName = ${input.nick} WHERE id = ${input.personId}`
        const { changes } = await context.app.sqlite.run(sql)
        if (changes === 0) {
          throw new Error(`Person id ${input.personId} not found`)
        }
        const person = await context.personDL.load(input.personId)
        context.reply.log.debug({ person }, 'Read updated person')
        return person
      }
    },
    Family: {
      members: async function membersFunc (parent, args, context, info) {
        const sql = SQL`SELECT * FROM person WHERE familyId = ${parent.id}`
        const membersData = await context.app.sqlite.all(sql)
        return membersData
      }
    },
    Person: {
      nickName: function nickNameFunc (parent) { return parent.nick },
      fullName: async function fullNameFunc (parent, args, context) {
        const sql = SQL`SELECT * FROM family WHERE id = ${parent.familyId}`
        const familyData = await context.app.sqlite.get(sql)
        return `${parent.name} ${familyData.name}`
      },
      family: async function familyFunc (parent, args, context) {
        const sql = SQL`SELECT * FROM family WHERE id = ${parent.familyId}`
        const familyData = await context.app.sqlite.get(sql)
        return familyData
      },
      friends: async function friendsFunc (parent, args, context) {
        const sql = SQL`SELECT * FROM person WHERE id IN (SELECT friendId FROM friend WHERE personId = ${parent.id})`
        const friendsData = await context.app.sqlite.all(sql)
        return friendsData
      }
    }
  }

  app.register(mercurius, {
    schema: gqlSchema,
    graphiql: true,
    resolvers
  })

  await app.listen({ port: 3000 })
}
