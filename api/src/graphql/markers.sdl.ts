export const schema = gql`
  type Marker {
    id: String!
    lat: Float!
    lng: Float!
    user: User!
    userId: String!
  }

  type Query {
    markers: [Marker!]! @skipAuth
    marker(id: String!): Marker @skipAuth
  }

  input CreateMarkerInput {
    lat: Float!
    lng: Float!
    userId: String!
  }

  input UpdateMarkerInput {
    lat: Float
    lng: Float
    userId: String
  }

  type Mutation {
    createMarker(input: CreateMarkerInput!): Marker! @skipAuth
    updateMarker(id: String!, input: UpdateMarkerInput!): Marker! @skipAuth
    deleteMarker(id: String!): Marker! @skipAuth
  }
`
