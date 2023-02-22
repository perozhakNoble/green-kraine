export const schema = gql`
  type Image {
    id: String!
    filename: String!
    path: String!
    problem: Problem
    problemId: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    images: [Image!]! @requireAuth
    image(id: String!): Image @requireAuth
  }

  input CreateImageInput {
    filename: String!
    path: String!
    problemId: String
  }

  input UpdateImageInput {
    filename: String
    path: String
    problemId: String
  }

  type Mutation {
    createImage(input: CreateImageInput!): Image! @requireAuth
    updateImage(id: String!, input: UpdateImageInput!): Image! @requireAuth
    deleteImage(id: String!): Image! @requireAuth
  }
`
