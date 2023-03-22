export const schema = gql`
  type Problem {
    id: String!
    title: String!
    description: String!
    severity: Int!
    keywords: [Keyword]!
    votes: [Vote]!
    comments: [Comment]!
    images: [Image]!
    category: Category
    categoryId: String
    marker: Marker
    markerId: String
    user: User
    userId: String
    status: ProblemStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum ProblemStatus {
    OPEN
    IN_PROGRESS
    RESOLVED
    REJECTED
  }

  type GetPaginatedProblems {
    items: [Problem!]!
    total: Int!
  }
  input ProblemsFilters {
    status: ProblemStatus
    category: String
    severity: Int
    keywords: [String!]
  }

  type Query {
    problemsList(
      filters: ProblemsFilters
      search: String
      pagination: PaginationInput!
    ): GetPaginatedProblems! @skipAuth
    problems: [Problem!]! @requireAuth
    problem(id: String!): Problem @requireAuth
  }

  input CreateProblemInput {
    title: String!
    description: String!
    severity: Int!
    categoryId: String
    markerId: String
    userId: String
    status: ProblemStatus!
  }

  input UpdateProblemInput {
    title: String
    description: String
    severity: Int
    categoryId: String
    markerId: String
    userId: String
    status: ProblemStatus
  }

  input MarkerInput {
    lat: Float!
    lng: Float!
  }
  input CreateProblemWithMarkerInput {
    title: String!
    description: String!
    severity: Int!
    categoryId: String
    keywords: [String!]!
    marker: MarkerInput!
  }

  type Mutation {
    createProblem(input: CreateProblemInput!): Problem! @requireAuth
    createProblemWithMarker(input: CreateProblemWithMarkerInput!): Problem!
      @requireAuth
    updateProblem(id: String!, input: UpdateProblemInput!): Problem!
      @requireAuth
    changeProblemStatus(id: String!, status: ProblemStatus!): Problem!
      @requireAuth
    deleteProblem(id: String!): Problem! @requireAuth
  }
`
