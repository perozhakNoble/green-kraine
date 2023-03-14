import type { Prisma, Category } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CategoryCreateArgs>({
  category: {
    one: {
      data: { name: 'String151320', updatedAt: '2023-02-21T16:25:53.244Z' },
    },
    two: {
      data: { name: 'String5539796', updatedAt: '2023-02-21T16:25:53.244Z' },
    },
  },
})

export type StandardScenario = ScenarioData<Category, 'category'>
