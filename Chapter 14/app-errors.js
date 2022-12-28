'use strict'

const Fastify = require('fastify')
const mercurius = require('mercurius')
const SQL = require('@nearform/sql')
const gqlSchema = require('./gql-schema')

const FamilyDataLoader = require('./data-loaders/family')
const PersonDataLoader = require('./data-loaders/person')
const PersonByFamilyDataLoader = require('./data-loaders/person-by-family')
const FriendDataLoader = require('./data-loaders/friend')

module.exports = build

if (require.main === module) {
  build()
    .then((app) => {
      return app.listen({ port: 3000 })
    }).catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

async function build () {
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
        const familyData = await context.familyDL.load(args.id)
        if (!familyData) {
          // throw new Error(`Family id ${args.id} not found`)
          throw new mercurius.ErrorWithProps(`Family id ${args.id} not found`, {
            ERR_CODE: 404
          })
        }
        return familyData
      }
    },
    Mutation: {
      changeNickName: async function changeNickNameFunc (parent, args, context, info) {
        const sql = SQL`UPDATE Person SET nick = ${args.nickName} WHERE id = ${args.personId}`
        const { changes } = await context.app.sqlite.run(sql)
        if (changes === 0) {
          throw new mercurius.ErrorWithProps(`Person id ${args.personId} not found`)
        }
        const person = await context.personDL.load(args.personId)
        context.reply.log.debug({ person }, 'Read updated person')
        return person
      },
      changeNickNameWithInput: async function changeNickNameFunc (parent, { input }, context, info) {
        const sql = SQL`UPDATE Person SET nick = ${input.nick} WHERE id = ${input.personId}`
        const { changes } = await context.app.sqlite.run(sql)
        if (changes === 0) {
          throw new mercurius.ErrorWithProps(`Person id ${input.personId} not found`)
        }
        const person = await context.personDL.load(input.personId)
        context.reply.log.debug({ person }, 'Read updated person')
        return person
      }
    },
    Family: {
      members: async function membersFunc (parent, args, context, info) {
        const membersData = await context.personsByFamilyDL.load(parent.id)
        return membersData
      }
    },
    Person: {
      nickName: function nickNameFunc (parent, args, context, info) {
        return parent.nick
      },
      family: async function familyFunc (parent, args, context, info) {
        return context.familyDL.load(parent.familyId)
      },
      fullName: async function fullName (parent, args, context, info) {
        const familyData = await context.familyDL.load(parent.familyId)
        return `${parent.name} ${familyData.name}`
      },
      friends: async function friendsFunc (parent, args, context, info) {
        const friendsData = await context.friendDL.load(parent.id)
        const personsData = await context.personDL.loadMany(friendsData.map((f) => f.friendId))
        return personsData
      }
    }
  }

  app.register(mercurius, {
    schema: gqlSchema,
    graphiql: true,
    errorFormatter: (result, context) => {
      result.errors = result.errors.map(hideSensitiveData)
      return mercurius.defaultErrorFormatter(result, context)
    },
    context: async function (request, reply) {
      const familyDL = FamilyDataLoader(app)
      const personDL = PersonDataLoader(app)
      const personsByFamilyDL = PersonByFamilyDataLoader(app)
      const friendDL = FriendDataLoader(app)

      return { familyDL, personDL, personsByFamilyDL, friendDL }
    },
    resolvers
  })

  function hideSensitiveData (error) {
    console.log(error.constructor.name)
    if (error.extensions) {
      return error
    }
    error.message = 'Internal server error'
    return error
  }

  return app
}
