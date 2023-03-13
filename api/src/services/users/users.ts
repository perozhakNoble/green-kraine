import { Prisma } from '@prisma/client'
import CryptoJS from 'crypto-js'
import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

enum UsersSortBy {
  name = 'name',
  email = 'email',
  problems_reported = 'problems_reported',
  problems_commented = 'problems_commented',
  role = 'role',
}

export const usersList: QueryResolvers['usersList'] = async (
  { filters, pagination, search },
  { context }
) => {
  const whereClause: Prisma.UserWhereInput = {
    id: {
      not: (context.currentUser as any).id,
    },
  }
  const orderClause: Prisma.UserOrderByWithRelationInput = {}

  switch (pagination.sortBy) {
    case UsersSortBy.name:
      orderClause.name = pagination.order
      break
    case UsersSortBy.email:
      orderClause.email = pagination.order
      break
    case UsersSortBy.problems_reported:
      orderClause.problems = {
        _count: pagination.order,
      }
      break
    case UsersSortBy.problems_commented:
      orderClause.comments = {
        _count: pagination.order,
      }
      break
    case UsersSortBy.role:
      orderClause.roles = pagination.order
      break

    default:
      orderClause.createdAt = 'asc'
  }

  if (filters) {
    if (filters.role) {
      whereClause.roles = filters.role
    }
  }

  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ]
  }

  const items = await db.user.findMany({
    where: whereClause,
    skip: pagination.skip,
    take: pagination.take,
    orderBy: orderClause,
  })

  const total = await db.user.count({
    where: whereClause,
  })

  return {
    items,
    total,
  }
}

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

const _getHashAndSaltFromPassword = (password: string) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString()
  const hashedPassword = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
  }).toString()

  return {
    salt,
    hashedPassword,
  }
}

export const createUser: MutationResolvers['createUser'] = ({
  input: _input,
}) => {
  const { password, ...input } = _input
  const { hashedPassword, salt } = _getHashAndSaltFromPassword(password)

  return db.user.create({
    data: { ...input, hashedPassword, salt },
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User: UserRelationResolvers = {
  votes: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).votes()
  },
  comments: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).comments()
  },
  problems: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).problems()
  },
  markers: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).markers()
  },
}
