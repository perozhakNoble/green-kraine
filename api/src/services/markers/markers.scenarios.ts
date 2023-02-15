import type { Prisma, Marker } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MarkerCreateArgs>({
  marker: {
    one: {
      data: {
        lat: 9604736.534055935,
        lng: 6129152.315010895,
        user: {
          create: {
            name: 'String',
            email: 'String323233',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
    two: {
      data: {
        lat: 8394371.602472091,
        lng: 6202001.922252201,
        user: {
          create: {
            name: 'String',
            email: 'String4133178',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Marker, 'marker'>
