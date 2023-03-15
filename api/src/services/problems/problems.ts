import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  ProblemRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

enum ProblemsSortBy {
  votes_count = 'votes_count',
  title = 'title',
  description = 'description',
  category = 'category',
  comments_count = 'comments_count',
  status = 'status',
  created_at = 'created_at',
  updated_at = 'updated_at',
  severity = 'severity',
}

export const problemsList: QueryResolvers['problemsList'] = async ({
  filters,
  pagination,
  search,
}) => {
  const whereClause: Prisma.ProblemWhereInput = {}
  const orderClause: Prisma.ProblemOrderByWithRelationInput = {}

  const order = pagination.order || 'asc'
  switch (pagination?.sortBy) {
    case ProblemsSortBy.votes_count:
      orderClause.votes = {
        _count: pagination.order,
      }
      break
    case ProblemsSortBy.description:
      orderClause.description = order
      break
    case ProblemsSortBy.title:
      orderClause.title = order
      break
    case ProblemsSortBy.severity:
      orderClause.severity = order
      break
    case ProblemsSortBy.category:
      orderClause.category = {
        name: pagination.order,
      }
      break
    case ProblemsSortBy.comments_count:
      orderClause.comments = {
        _count: pagination.order,
      }
      break
    case ProblemsSortBy.status:
      orderClause.status = order
      break
    case ProblemsSortBy.created_at:
      orderClause.createdAt = order
      break
    case ProblemsSortBy.updated_at:
      orderClause.updatedAt = order
      break

    default:
      orderClause.createdAt = 'desc'
  }

  if (filters) {
    if (filters.status) {
      whereClause.status = filters.status
    }
  }

  if (search) {
    whereClause.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        category: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
    ]
  }

  const items = await db.problem.findMany({
    where: whereClause,
    skip: pagination.skip,
    take: pagination.take,
    orderBy: orderClause,
  })

  const total = await db.problem.count({
    where: whereClause,
  })

  return {
    items,
    total,
  }
}

export const problems: QueryResolvers['problems'] = () => {
  return db.problem.findMany()
}

export const problem: QueryResolvers['problem'] = ({ id }) => {
  return db.problem.findUnique({
    where: { id },
  })
}

export const createProblemWithMarker: MutationResolvers['createProblemWithMarker'] =
  ({ input }, { context }) => {
    const { marker, categoryId, keywords, ...data } = input
    return db.problem.create({
      data: {
        ...data,
        category: {
          connect: {
            id: categoryId,
          },
        },
        keywords: {
          connect: keywords.map((keyword) => ({ title: keyword })),
        },
        user: {
          connect: {
            id: (context.currentUser as any)?.id,
          },
        },
        marker: {
          create: {
            lat: marker.lat,
            lng: marker.lng,
            user: {
              connect: {
                id: (context.currentUser as any)?.id,
              },
            },
          },
        },
      },
    })
  }

export const createProblem: MutationResolvers['createProblem'] = ({
  input,
}) => {
  return db.problem.create({
    data: input,
  })
}

export const updateProblem: MutationResolvers['updateProblem'] = ({
  id,
  input,
}) => {
  return db.problem.update({
    data: input,
    where: { id },
  })
}

export const deleteProblem: MutationResolvers['deleteProblem'] = ({ id }) => {
  return db.problem.delete({
    where: { id },
  })
}

export const Problem: ProblemRelationResolvers = {
  keywords: (_obj, { root }) => {
    return db.problem.findUnique({ where: { id: root?.id } }).keywords()
  },
  votes: (_obj, { root }) => {
    return db.problem.findUnique({ where: { id: root?.id } }).votes()
  },
  comments: (_obj, { root }) => {
    return db.problem.findUnique({ where: { id: root?.id } }).comments()
  },
  images: (_obj, { root }) => {
    return db.problem.findUnique({ where: { id: root?.id } }).images()
  },
  category: (_obj, { root }) => {
    return db.problem.findUnique({ where: { id: root?.id } }).category()
  },
  marker: (_obj, { root }) => {
    return db.problem.findUnique({ where: { id: root?.id } }).marker()
  },
  user: (_obj, { root }) => {
    return db.problem.findUnique({ where: { id: root?.id } }).user()
  },
}
