export const PROBLEMS_QUERY = gql`
  query ProblemsQuery($pagination: PaginationInput!, $search: String) {
    problemsList(pagination: $pagination, search: $search) {
      items {
        id
        title
      }
      total
    }
  }
`

export const CREATE_PROBLEM_MUTATION = gql`
  mutation CreateProblem($input: CreateProblemInput!) {
    createProblem(input: $input) {
      id
    }
  }
`

export const UPDATE_PROBLEM_MUTATION = gql`
  mutation UpdateProblem($id: String!, $input: UpdateProblemInput!) {
    updateProblem(id: $id, input: $input) {
      id
    }
  }
`

export const DELETE_PROBLEM_MUTATION = gql`
  mutation DeleteProblem($id: String!) {
    deleteProblem(id: $id) {
      id
    }
  }
`
