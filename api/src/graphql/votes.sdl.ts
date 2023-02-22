export const schema = gql`
  type Vote {
    id: String!
    upvote: Boolean!
    user: User
    userId: String
    problem: Problem
    problemId: String
  }

  type Query {
    votes: [Vote!]! @requireAuth
    vote(id: String!): Vote @requireAuth
  }

  input CreateVoteInput {
    upvote: Boolean!
    userId: String
    problemId: String
  }

  input UpdateVoteInput {
    upvote: Boolean
    userId: String
    problemId: String
  }

  type Mutation {
    createVote(input: CreateVoteInput!): Vote! @requireAuth
    updateVote(id: String!, input: UpdateVoteInput!): Vote! @requireAuth
    upsertVote(problemId: String!, upvote: Boolean!): Vote! @requireAuth
    deleteVote(id: String!): Vote! @requireAuth
    deleteVoteByProblemId(problemId: String!): Vote! @requireAuth
  }
`
