import type { Prisma, Image } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ImageCreateArgs>({
  image: {
    one: {
      data: {
        filename: 'String',
        path: 'String',
        updatedAt: '2023-02-21T16:26:43.864Z',
      },
    },
    two: {
      data: {
        filename: 'String',
        path: 'String',
        updatedAt: '2023-02-21T16:26:43.864Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Image, 'image'>
