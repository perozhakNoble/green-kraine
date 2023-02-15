export const schema = gql`
  type User {
    id: String!
    name: String!
    email: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: UserRole!
    markers: [Marker]!
  }

  enum UserRole {
    USER
    ANALYST
    MODERATOR
    ADMIN
  }

  type Query {
    users: [User!]! @skipAuth
    user(id: String!): User @skipAuth
  }

  input CreateUserInput {
    name: String!
    email: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: UserRole!
  }

  input UpdateUserInput {
    name: String
    email: String
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: UserRole
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @skipAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @skipAuth
    deleteUser(id: String!): User! @skipAuth
  }
`
