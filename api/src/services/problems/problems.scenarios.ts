import type { Prisma, Problem } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ProblemCreateArgs>({
  problem: {
    one: {
      data: {
        title: 'String',
        description: 'String',
        updatedAt: '2023-02-27T17:11:41.340Z',
      },
    },
    two: {
      data: {
        title: 'String',
        description: 'String',
        updatedAt: '2023-02-27T17:11:41.340Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Problem, 'problem'>
