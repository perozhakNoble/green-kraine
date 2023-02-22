import type { Prisma, Comment } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CommentCreateArgs>({
  comment: {
    one: { data: { content: 'String' } },
    two: { data: { content: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Comment, 'comment'>
