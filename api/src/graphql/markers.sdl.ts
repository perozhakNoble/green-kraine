export const schema = gql`
  type Marker {
    id: String!
    lat: Float!
    lng: Float!
    user: User!
    userId: String!
  }

  type Query {
    markers: [Marker!]! @requireAuth
    marker(id: String!): Marker @requireAuth
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
    createMarker(input: CreateMarkerInput!): Marker! @requireAuth
    updateMarker(id: String!, input: UpdateMarkerInput!): Marker! @requireAuth
    deleteMarker(id: String!): Marker! @requireAuth
  }
`
