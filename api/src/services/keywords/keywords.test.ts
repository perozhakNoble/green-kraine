import type { Keyword } from '@prisma/client'

import {
  keywords,
  keyword,
  createKeyword,
  updateKeyword,
  deleteKeyword,
} from './keywords'
import type { StandardScenario } from './keywords.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('keywords', () => {
  scenario('returns all keywords', async (scenario: StandardScenario) => {
    const result = await keywords()

    expect(result.length).toEqual(Object.keys(scenario.keyword).length)
  })

  scenario('returns a single keyword', async (scenario: StandardScenario) => {
    const result = await keyword({ id: scenario.keyword.one.id })

    expect(result).toEqual(scenario.keyword.one)
  })

  scenario('creates a keyword', async () => {
    const result = await createKeyword({
      input: { title: 'String7876838', updatedAt: '2023-02-27T17:11:18.339Z' },
    })

    expect(result.title).toEqual('String7876838')
    expect(result.updatedAt).toEqual(new Date('2023-02-27T17:11:18.339Z'))
  })

  scenario('updates a keyword', async (scenario: StandardScenario) => {
    const original = (await keyword({ id: scenario.keyword.one.id })) as Keyword
    const result = await updateKeyword({
      id: original.id,
      input: { title: 'String72653032' },
    })

    expect(result.title).toEqual('String72653032')
  })

  scenario('deletes a keyword', async (scenario: StandardScenario) => {
    const original = (await deleteKeyword({
      id: scenario.keyword.one.id,
    })) as Keyword
    const result = await keyword({ id: original.id })

    expect(result).toEqual(null)
  })
})
