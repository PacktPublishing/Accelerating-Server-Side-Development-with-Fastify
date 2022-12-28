'use strict'

module.exports = `

type Family {
  id: ID!
  name: String!
  members: [Person!]!
}

type Person {
  id: ID!
  family: Family!
  fullName: String!
  nickName: String
  friends: [Person!]!
}

type Query {
  family(id: ID!): Family
}

input NewNickName {
  personId: ID!
  nick: String!
}

type Mutation {
  changeNickName(personId: ID!, nickName: String!): Person
  changeNickNameWithInput(input: NewNickName): Person!
}

type Subscription {
  personChanged: Person
}
`
