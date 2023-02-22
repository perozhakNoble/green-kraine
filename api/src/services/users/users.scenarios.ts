import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        name: 'String',
        email: 'String3851580',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2023-02-21T16:25:23.911Z',
      },
    },
    two: {
      data: {
        name: 'String',
        email: 'String8764804',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2023-02-21T16:25:23.911Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
