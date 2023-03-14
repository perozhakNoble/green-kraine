export const schema = gql`
  type User {
    id: String!
    name: String!
    email: String!
    hashedPassword: String!
    salt: String!
    votes: [Vote]!
    comments: [Comment]!
    problems: [Problem]!
    markers: [Marker]!
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum UserRole {
    USER
    ANALYST
    ADMIN
  }

  type GetPaginatedUsers {
    items: [User!]!
    total: Int!
  }
  input UsersFilter {
    role: UserRole
  }

  type Query {
    usersList(
      filters: UsersFilter
      search: String
      pagination: PaginationInput!
    ): GetPaginatedUsers! @requireAuth
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    roles: UserRole!
  }

  input UpdateUserInput {
    name: String
    email: String
    roles: UserRole
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    resetUserPassword(id: String!, password: String!): User!
      @requireAuth(roles: ["ADMIN"])
    deleteUser(id: String!): User! @requireAuth
  }
`
