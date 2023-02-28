import type {
  QueryResolvers,
  MutationResolvers,
  KeywordRelationResolvers,
} from 'types/graphql'

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
  return db.keyword.create({
    data: input,
  })
}

export const updateKeyword: MutationResolvers['updateKeyword'] = ({
  id,
  input,
}) => {
  return db.keyword.update({
    data: input,
    where: { id },
  })
}

export const deleteKeyword: MutationResolvers['deleteKeyword'] = ({ id }) => {
  return db.keyword.delete({
    where: { id },
  })
}

export const Keyword: KeywordRelationResolvers = {
  Problem: (_obj, { root }) => {
    return db.keyword.findUnique({ where: { id: root?.id } }).Problem()
  },
}
