export const schema = gql`
  type Keyword {
    id: String!
    title: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    Problem: Problem
    problemId: String
  }

  type Query {
    keywords: [Keyword!]! @requireAuth
    keyword(id: String!): Keyword @requireAuth
  }

  input CreateKeywordInput {
    title: String!
    problemId: String
  }

  input UpdateKeywordInput {
    title: String
    problemId: String
  }

  type Mutation {
    createKeyword(input: CreateKeywordInput!): Keyword! @requireAuth
    updateKeyword(id: String!, input: UpdateKeywordInput!): Keyword!
      @requireAuth
    deleteKeyword(id: String!): Keyword! @requireAuth
  }
`
