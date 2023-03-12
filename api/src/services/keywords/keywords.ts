import type {
  QueryResolvers,
  MutationResolvers,
  KeywordRelationResolvers,
} from 'types/graphql'

import { validateUniqueness } from '@redwoodjs/api'

import { db } from 'src/lib/db'

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
  problem: (_obj, { root }) => {
    return db.keyword.findUnique({ where: { id: root?.id } }).problem()
  },
}
