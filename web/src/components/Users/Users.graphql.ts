export const USERS_QUERY = gql`
  query UsersQuery(
    $pagination: PaginationInput!
    $search: String
    $filters: UsersFilter
  ) {
    usersList(pagination: $pagination, search: $search, filters: $filters) {
      items {
        id
        name
        email
        roles
        comments {
          id
        }
        problems {
          id
        }
      }
      total
    }
  }
`

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
    }
  }
`

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`
