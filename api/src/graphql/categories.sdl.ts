export const schema = gql`
  type Category {
    id: String!
    name: String!
    problems: [Problem]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type GetPaginatedCategories {
    items: [Category!]!
    total: Int!
  }
  input CategoriesFilters {
    name: String
  }

  type Query {
    categoriesList(
      filters: CategoriesFilters
      search: String
      pagination: PaginationInput!
    ): GetPaginatedCategories! @requireAuth
    categories: [Category!]! @requireAuth
    category(id: String!): Category @requireAuth
  }

  input CreateCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    name: String
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): Category! @requireAuth
    updateCategory(id: String!, input: UpdateCategoryInput!): Category!
      @requireAuth
    deleteCategory(id: String!): Category! @requireAuth
  }
`
