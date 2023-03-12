export const schema = gql`
  type Keyword {
    id: String!
    title: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    problems: [Problem]!
  }
  type GetPaginatedKeywords {
    items: [Keyword!]!
    total: Int!
  }
  input KeywordsFilters {
    title: String
  }
  type Query {
    keywordsList(
      filters: KeywordsFilters
      search: String
      pagination: PaginationInput!
    ): GetPaginatedKeywords! @requireAuth
    keywords: [Keyword!]! @requireAuth
    keyword(id: String!): Keyword @requireAuth
  }

  input CreateKeywordInput {
    title: String!
  }

  input UpdateKeywordInput {
    title: String
  }

  type Mutation {
    createKeyword(input: CreateKeywordInput!): Keyword! @requireAuth
    updateKeyword(id: String!, input: UpdateKeywordInput!): Keyword!
      @requireAuth
    deleteKeyword(id: String!): Keyword! @requireAuth
  }
`
