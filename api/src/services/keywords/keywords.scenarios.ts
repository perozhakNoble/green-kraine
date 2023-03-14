import type { Prisma, Keyword } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.KeywordCreateArgs>({
  keyword: {
    one: {
      data: { title: 'String330891', updatedAt: '2023-02-27T17:11:18.375Z' },
    },
    two: {
      data: { title: 'String7409357', updatedAt: '2023-02-27T17:11:18.375Z' },
    },
  },
})

export type StandardScenario = ScenarioData<Keyword, 'keyword'>
