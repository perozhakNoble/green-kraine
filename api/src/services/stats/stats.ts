import { Prisma } from '@prisma/client'
import _ from 'lodash'
import { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const getStats: QueryResolvers['getStats'] = async ({ filters }) => {
  const problemsWhereClause: Prisma.ProblemWhereInput = {}
  const keywordsWhereClause: Prisma.KeywordWhereInput = {}
  const categoriesWhereClause: Prisma.CategoryWhereInput = {}

  if (filters) {
    keywordsWhereClause.problems = {
      some: {
        AND: [
          filters.dateTo
            ? {
                createdAt: {
                  lte: filters.dateTo,
                },
              }
            : {},
          filters.dateFrom
            ? {
                createdAt: {
                  gte: filters.dateFrom,
                },
              }
            : {},
        ],
      },
    }
    categoriesWhereClause.problems = {
      some: {
        AND: [
          filters.dateTo
            ? {
                createdAt: {
                  lte: filters.dateTo,
                },
              }
            : {},
          filters.dateFrom
            ? {
                createdAt: {
                  gte: filters.dateFrom,
                },
              }
            : {},
        ],
      },
    }
    problemsWhereClause.AND = [
      filters.dateTo
        ? {
            createdAt: {
              lte: filters.dateTo,
            },
          }
        : {},
      filters.dateFrom
        ? {
            createdAt: {
              gte: filters.dateFrom,
            },
          }
        : {},
    ]
  }

  const problems = await db.problem.findMany({
    where: problemsWhereClause,
    include: {
      category: true,
      keywords: true,
      votes: true,
    },
  })

  const keywords = (
    await db.keyword.findMany({
      where: keywordsWhereClause,
      include: {
        problems: true,
      },
    })
  ).map((keyword) => ({
    ...keyword,
    problems: keyword.problems.filter((p) =>
      problems.some((pr) => pr.id === p.id)
    ),
  }))

  const categories = (
    await db.category.findMany({
      where: categoriesWhereClause,
      include: {
        problems: true,
      },
    })
  ).map((category) => ({
    ...category,
    problems: category.problems.filter((p) =>
      problems.some((pr) => pr.id === p.id)
    ),
  }))

  const groupedByCategory = _.groupBy(problems, 'category.name')

  return {
    votes: {
      dislikes: problems.reduce((total, problem) => {
        return (total += problem.votes.filter((v) => !v.upvote).length)
      }, 0),
      likes: problems.reduce((total, problem) => {
        return (total += problem.votes.filter((v) => v.upvote).length)
      }, 0),
    },
    statuses: {
      OPEN: problems.filter((problem) => problem.status === 'OPEN').length,
      IN_PROGRESS: problems.filter(
        (problem) => problem.status === 'IN_PROGRESS'
      ).length,
      RESOLVED: problems.filter((problem) => problem.status === 'RESOLVED')
        .length,
      REJECTED: problems.filter((problem) => problem.status === 'REJECTED')
        .length,
    },
    categories: Object.keys(groupedByCategory).map((key) => ({
      name: key,
      count: groupedByCategory[key].length,
    })),
    keywords: keywords.map((k) => ({
      name: k.title,
      count: k.problems.length,
    })),
    categoriesByStatus: categories.map((c) => ({
      name: c.name,
      IN_PROGRESS: c.problems.filter((p) => p.status === 'IN_PROGRESS').length,
      OPEN: c.problems.filter((p) => p.status === 'OPEN').length,
      REJECTED: c.problems.filter((p) => p.status === 'REJECTED').length,
      RESOLVED: c.problems.filter((p) => p.status === 'REJECTED').length,
    })),
  }
}
