export const schema = gql`
  type Comment {
    id: String!
    content: String!
    user: User
    userId: String
    problem: Problem
    problemId: String
  }

  type Query {
    comments: [Comment!]! @requireAuth
    comment(id: String!): Comment @requireAuth
  }

  input CreateCommentInput {
    content: String!
    userId: String
    problemId: String
  }

  input UpdateCommentInput {
    content: String
    userId: String
    problemId: String
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment! @requireAuth
    updateComment(id: String!, input: UpdateCommentInput!): Comment!
      @requireAuth
    deleteComment(id: String!): Comment! @requireAuth
  }
`
