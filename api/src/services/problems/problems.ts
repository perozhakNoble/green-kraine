import type {
  QueryResolvers,
  MutationResolvers,
  ProblemRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const problems: QueryResolvers['problems'] = () => {
  return db.problem.findMany()
}

export const problem: QueryResolvers['problem'] = ({ id }) => {
  return db.problem.findUnique({
    where: { id },
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
