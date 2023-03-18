export const schema = gql`
  type Marker {
    id: String!
    lat: Float!
    lng: Float!
    problem: Problem
    user: User
    userId: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    markers(userId: String, filters: ProblemsFilters): [Marker!]! @skipAuth
    marker(id: String!): Marker @requireAuth
  }

  input CreateMarkerInput {
    lat: Float!
    lng: Float!
    userId: String
  }

  input UpdateMarkerInput {
    lat: Float
    lng: Float
    userId: String
  }

  type Mutation {
    createMarker(input: CreateMarkerInput!): Marker! @requireAuth
    updateMarker(id: String!, input: UpdateMarkerInput!): Marker! @requireAuth
    deleteMarker(id: String!): Marker! @requireAuth
  }
`
