import type { Problem } from '@prisma/client'

import {
  problems,
  problem,
  createProblem,
  updateProblem,
  deleteProblem,
} from './problems'
import type { StandardScenario } from './problems.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('problems', () => {
  scenario('returns all problems', async (scenario: StandardScenario) => {
    const result = await problems()

    expect(result.length).toEqual(Object.keys(scenario.problem).length)
  })

  scenario('returns a single problem', async (scenario: StandardScenario) => {
    const result = await problem({ id: scenario.problem.one.id })

    expect(result).toEqual(scenario.problem.one)
  })

  scenario('creates a problem', async () => {
    const result = await createProblem({
      input: {
        title: 'String',
        description: 'String',
        updatedAt: '2023-02-27T17:11:41.317Z',
      },
    })

    expect(result.title).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-02-27T17:11:41.317Z'))
  })

  scenario('updates a problem', async (scenario: StandardScenario) => {
    const original = (await problem({ id: scenario.problem.one.id })) as Problem
    const result = await updateProblem({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a problem', async (scenario: StandardScenario) => {
    const original = (await deleteProblem({
      id: scenario.problem.one.id,
    })) as Problem
    const result = await problem({ id: original.id })

    expect(result).toEqual(null)
  })
})
