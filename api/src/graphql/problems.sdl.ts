export const schema = gql`
  type Problem {
    id: String!
    title: String!
    description: String!
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

  type Query {
    problems: [Problem!]! @requireAuth
    problem(id: String!): Problem @requireAuth
  }

  input CreateProblemInput {
    title: String!
    description: String!
    categoryId: String
    markerId: String
    userId: String
    status: ProblemStatus!
  }

  input UpdateProblemInput {
    title: String
    description: String
    categoryId: String
    markerId: String
    userId: String
    status: ProblemStatus
  }

  type Mutation {
    createProblem(input: CreateProblemInput!): Problem! @requireAuth
    updateProblem(id: String!, input: UpdateProblemInput!): Problem!
      @requireAuth
    deleteProblem(id: String!): Problem! @requireAuth
  }
`
