export const KEYWORDS_QUERY = gql`
  query KeywordsQuery($pagination: PaginationInput!, $search: String) {
    keywordsList(pagination: $pagination, search: $search) {
      items {
        id
        title
        problems {
          id
        }
      }
      total
    }
  }
`

export const CREATE_KEYWORD_MUTATION = gql`
  mutation CreateKeyword($input: CreateKeywordInput!) {
    createKeyword(input: $input) {
      id
    }
  }
`

export const UPDATE_KEYWORD_MUTATION = gql`
  mutation UpdateKeyword($id: String!, $input: UpdateKeywordInput!) {
    updateKeyword(id: $id, input: $input) {
      id
    }
  }
`

export const DELETE_KEYWORD_MUTATION = gql`
  mutation DeleteKeyword($id: String!) {
    deleteKeyword(id: $id) {
      id
    }
  }
`
