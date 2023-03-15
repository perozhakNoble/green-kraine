export const CATEGORIES_QUERY = gql`
  query CategoriesQuery($pagination: PaginationInput!, $search: String) {
    categoriesList(pagination: $pagination, search: $search) {
      items {
        id
        name
        problems {
          id
        }
      }
      total
    }
  }
`

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
    }
  }
`

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
    }
  }
`

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      id
    }
  }
`

export const GET_CATEGORIES_AS_OPTIONS = gql`
  query GetCategoriesAsOptions {
    options: categories {
      value: id
      label: name
    }
  }
`
