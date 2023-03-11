export const schema = gql`
  enum SortOrder {
    asc
    desc
  }

  input PaginationInput {
    take: Int!
    skip: Int!
    sortBy: String
    order: SortOrder
  }
`
