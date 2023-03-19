import { QueryResolvers } from 'types/graphql'

export const getStats: QueryResolvers['getStats'] = async () => {
  return {
    votes: {
      dislikes: 455,
      likes: 123,
    },
    statuses: {
      OPEN: 12,
      IN_PROGRESS: 15,
      RESOLVED: 3,
      REJECTED: 6,
    },
    categories: [
      {
        name: 'Public',
        count: 12,
      },
      {
        name: 'Lol',
        count: 31,
      },
      {
        name: 'Genesis',
        count: 11,
      },
      {
        name: 'Chemp',
        count: 23,
      },
    ],
    keywords: [
      {
        name: 'Public',
        count: 12,
      },
      {
        name: 'Lol',
        count: 31,
      },
      {
        name: 'Genesis',
        count: 11,
      },
      {
        name: 'Chemp',
        count: 23,
      },
    ],
    categoriesByStatus: [
      {
        name: 'Public',
        IN_PROGRESS: 43,
        OPEN: 12,
        REJECTED: 25,
        RESOLVED: 31,
      },
      {
        name: 'Lol',
        IN_PROGRESS: 24,
        OPEN: 6,
        REJECTED: 16,
        RESOLVED: 13,
      },
      {
        name: 'Genesis',
        IN_PROGRESS: 63,
        OPEN: 27,
        REJECTED: 11,
        RESOLVED: 32,
      },
      {
        name: 'Chemp',
        IN_PROGRESS: 34,
        OPEN: 21,
        REJECTED: 52,
        RESOLVED: 13,
      },
    ],
  }
}
