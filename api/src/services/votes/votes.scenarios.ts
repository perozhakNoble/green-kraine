import type { Prisma, Vote } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.VoteCreateArgs>({
  vote: { one: { data: {} }, two: { data: {} } },
})

export type StandardScenario = ScenarioData<Vote, 'vote'>
