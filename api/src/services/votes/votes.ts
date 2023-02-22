import type {
  QueryResolvers,
  MutationResolvers,
  VoteRelationResolvers,
  User,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const votes: QueryResolvers['votes'] = () => {
  return db.vote.findMany()
}

export const vote: QueryResolvers['vote'] = ({ id }) => {
  return db.vote.findUnique({
    where: { id },
  })
}

export const createVote: MutationResolvers['createVote'] = ({ input }) => {
  return db.vote.create({
    data: input,
  })
}

export const updateVote: MutationResolvers['updateVote'] = ({ id, input }) => {
  return db.vote.update({
    data: input,
    where: { id },
  })
}

export const upsertVote: MutationResolvers['upsertVote'] = (
  { problemId, upvote },
  obj
) => {
  return db.vote.upsert({
    create: {
      upvote,
      problem: {
        connect: {
          id: problemId,
        },
      },
      user: {
        connect: {
          email: (obj.context.currentUser as Partial<User>)?.email,
        },
      },
    },
    update: {
      upvote,
    },
    where: {
      userId_problemId: {
        problemId,
        userId: (obj.context.currentUser as Partial<User>)?.id,
      },
    },
  })
}

export const deleteVote: MutationResolvers['deleteVote'] = ({ id }) => {
  return db.vote.delete({
    where: { id },
  })
}

export const deleteVoteByProblemId: MutationResolvers['deleteVoteByProblemId'] =
  ({ problemId }, obj) => {
    return db.vote.delete({
      where: {
        userId_problemId: {
          problemId,
          userId: (obj.context.currentUser as Partial<User>)?.id,
        },
      },
    })
  }

export const Vote: VoteRelationResolvers = {
  user: (_obj, { root }) => {
    return db.vote.findUnique({ where: { id: root?.id } }).user()
  },
  problem: (_obj, { root }) => {
    return db.vote.findUnique({ where: { id: root?.id } }).problem()
  },
}
