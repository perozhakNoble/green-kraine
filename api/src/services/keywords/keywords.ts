import { Prisma } from '.prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  KeywordRelationResolvers,
} from 'types/graphql'

import { validateUniqueness } from '@redwoodjs/api'

import { db } from 'src/lib/db'

enum KeywordsSortBy {
  title = 'title',
  usage_count = 'usage_count',
}

export const keywordsList: QueryResolvers['keywordsList'] = async ({
  filters,
  pagination,
  search,
}) => {
  const whereClause: Prisma.KeywordWhereInput = {}
  const orderClause: Prisma.KeywordOrderByWithRelationInput = {}

  const order = pagination.order || 'asc'
  switch (pagination?.sortBy) {
    case KeywordsSortBy.title:
      orderClause.title = order
      break
    case KeywordsSortBy.usage_count:
      orderClause.problems = {
        _count: pagination.order,
      }
      break

    default:
      orderClause.createdAt = 'desc'
  }

  if (filters) {
    if (filters.title) {
      whereClause.title = filters.title
    }
  }

  if (search) {
    whereClause.title = {
      contains: search,
      mode: 'insensitive',
    }
  }

  const items = await db.keyword.findMany({
    where: whereClause,
    skip: pagination.skip,
    take: pagination.take,
    orderBy: orderClause,
  })

  const total = await db.keyword.count({
    where: whereClause,
  })

  return {
    items,
    total,
  }
}

export const keywords: QueryResolvers['keywords'] = () => {
  return db.keyword.findMany()
}

export const keyword: QueryResolvers['keyword'] = ({ id }) => {
  return db.keyword.findUnique({
    where: { id },
  })
}

export const createKeyword: MutationResolvers['createKeyword'] = ({
  input,
}) => {
  return validateUniqueness(
    'keyword',
    { title: input.title },
    {
      message: 'Keyword title must be unique.',
    },
    (db) => {
      return db.keyword.create({
        data: input,
      })
    }
  )
}

export const updateKeyword: MutationResolvers['updateKeyword'] = ({
  id,
  input,
}) => {
  return validateUniqueness(
    'keyword',
    { title: input.title, $self: { id } },
    {
      message: 'Keyword title must be unique.',
    },
    (db) => {
      return db.keyword.update({
        data: input,
        where: { id },
      })
    }
  )
}

export const deleteKeyword: MutationResolvers['deleteKeyword'] = ({ id }) => {
  return db.keyword.delete({
    where: { id },
  })
}

export const Keyword: KeywordRelationResolvers = {
  problems: (_obj, { root }) => {
    return db.keyword.findUnique({ where: { id: root?.id } }).problems()
  },
}
