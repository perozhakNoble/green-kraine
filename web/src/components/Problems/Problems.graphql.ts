export const PROBLEMS_QUERY = gql`
  query ProblemsQuery(
    $pagination: PaginationInput!
    $search: String
    $filters: ProblemsFilters
  ) {
    problemsList(pagination: $pagination, search: $search, filters: $filters) {
      items {
        id
        title
        severity
        status
        description
        keywords {
          id
          title
        }
        createdAt
        updatedAt
        comments {
          id
        }
        category {
          id
          name
        }
        votes {
          id
        }
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

export const CHANGE_PROBLEM_STATUS_MUTATION = gql`
  mutation ChangeProblemStatus($id: String!, $status: ProblemStatus!) {
    changeProblemStatus(id: $id, status: $status) {
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
