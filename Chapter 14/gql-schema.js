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

input AddFamilyInput {
  name: String!
  members: [AddPersonInput]!
}

# ! deve essere aggiunto al libro
input AddPersonInput {
  name: String!
  nick: String
}

type Mutation {
  changeNickName(personId: ID!, nickName: String!): Person
  addFamily(newFamily: AddFamilyInput): ID!
}

type Subscription {
  personChanged: Person
}
`
