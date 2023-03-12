import { Prisma } from '.prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  CategoryRelationResolvers,
} from 'types/graphql'

import { validateUniqueness } from '@redwoodjs/api'

import { db } from 'src/lib/db'

enum CategoriesSortBy {
  name = 'name',
  usage_count = 'usage_count',
}

export const categoriesList: QueryResolvers['categoriesList'] = async ({
  filters,
  pagination,
  search,
}) => {
  const whereClause: Prisma.CategoryWhereInput = {}
  const orderClause: Prisma.CategoryOrderByWithRelationInput = {}

  switch (pagination.sortBy) {
    case CategoriesSortBy.name:
      orderClause.name = pagination.order
      break
    case CategoriesSortBy.usage_count:
      orderClause.problems = {
        _count: pagination.order,
      }
      break

    default:
      orderClause.createdAt = 'asc'
  }

  if (filters) {
    if (filters.name) {
      whereClause.name = filters.name
    }
  }

  if (search) {
    whereClause.name = {
      contains: search,
      mode: 'insensitive',
    }
  }

  const items = await db.category.findMany({
    where: whereClause,
    skip: pagination.skip,
    take: pagination.take,
    orderBy: orderClause,
  })

  const total = await db.category.count({
    where: whereClause,
  })

  return {
    items,
    total,
  }
}

export const categories: QueryResolvers['categories'] = () => {
  return db.category.findMany()
}

export const category: QueryResolvers['category'] = ({ id }) => {
  return db.category.findUnique({
    where: { id },
  })
}

export const createCategory: MutationResolvers['createCategory'] = ({
  input,
}) => {
  return validateUniqueness(
    'category',
    { name: input.name },
    {
      message: 'Category name must be unique.',
    },
    (db) => {
      return db.category.create({
        data: input,
      })
    }
  )
}

export const updateCategory: MutationResolvers['updateCategory'] = ({
  id,
  input,
}) => {
  return validateUniqueness(
    'category',
    { name: input.name, $self: { id } },
    {
      message: 'Category name must be unique.',
    },
    (db) => {
      return db.category.update({
        data: input,
        where: { id },
      })
    }
  )
}

export const deleteCategory: MutationResolvers['deleteCategory'] = ({ id }) => {
  return db.category.delete({
    where: { id },
  })
}

export const Category: CategoryRelationResolvers = {
  problems: (_obj, { root }) => {
    return db.category.findUnique({ where: { id: root?.id } }).problems()
  },
}
