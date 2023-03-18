import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  MarkerRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const markers: QueryResolvers['markers'] = ({
  userId,
  filters,
} = {}) => {
  const whereClause: Prisma.MarkerWhereInput = {}

  if (userId) {
    whereClause.userId = userId
  }

  if (filters) {
    whereClause.problem = {}
    if (filters.status) {
      whereClause.problem.status = filters.status
    }
    if (filters.category) {
      whereClause.problem.category = {
        id: filters.category,
      }
    }
    if (filters.severity) {
      whereClause.problem.severity = filters.severity
    }
    if (filters.keywords && filters.keywords.length) {
      whereClause.problem.keywords = {
        some: {
          id: {
            in: filters.keywords,
          },
        },
      }
    }
  }

  return db.marker.findMany({
    where: whereClause,
  })
}

export const marker: QueryResolvers['marker'] = ({ id }) => {
  return db.marker.findUnique({
    where: { id },
  })
}

export const createMarker: MutationResolvers['createMarker'] = ({ input }) => {
  return db.marker.create({
    data: input,
  })
}

export const updateMarker: MutationResolvers['updateMarker'] = ({
  id,
  input,
}) => {
  return db.marker.update({
    data: input,
    where: { id },
  })
}

export const deleteMarker: MutationResolvers['deleteMarker'] = ({ id }) => {
  return db.marker.delete({
    where: { id },
  })
}

export const Marker: MarkerRelationResolvers = {
  problem: (_obj, { root }) => {
    return db.marker.findUnique({ where: { id: root?.id } }).problem()
  },
  user: (_obj, { root }) => {
    return db.marker.findUnique({ where: { id: root?.id } }).user()
  },
}
