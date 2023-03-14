import type { Prisma, Marker } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MarkerCreateArgs>({
  marker: {
    one: {
      data: {
        lat: 4996575.3191554295,
        lng: 5389827.976419737,
        updatedAt: '2023-02-21T16:25:38.699Z',
      },
    },
    two: {
      data: {
        lat: 9474673.603140183,
        lng: 3596191.148032839,
        updatedAt: '2023-02-21T16:25:38.699Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Marker, 'marker'>
