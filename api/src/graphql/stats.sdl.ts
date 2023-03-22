export const schema = gql`
  type VotesStats {
    likes: Int!
    dislikes: Int!
  }

  type StatusesStats {
    OPEN: Int!
    IN_PROGRESS: Int!
    RESOLVED: Int!
    REJECTED: Int!
  }

  type CategoriesStats {
    name: String!
    count: Int!
  }

  type KeywordsStats {
    name: String!
    count: Int!
  }

  type CategoriesByStatusStats {
    name: String!
    IN_PROGRESS: Int!
    OPEN: Int!
    REJECTED: Int!
    RESOLVED: Int!
  }

  type GetStatsResult {
    votes: VotesStats!
    statuses: StatusesStats!
    categories: [CategoriesStats!]!
    keywords: [KeywordsStats!]!
    categoriesByStatus: [CategoriesByStatusStats!]
  }

  input StatsFilters {
    dateFrom: DateTime
    dateTo: DateTime
  }
  type Query {
    getStats(filters: StatsFilters): GetStatsResult!
      @requireAuth(roles: ["ADMIN", "ANALYST"])
  }
`
