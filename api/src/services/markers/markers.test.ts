import type { Marker } from '@prisma/client'

import {
  markers,
  marker,
  createMarker,
  updateMarker,
  deleteMarker,
} from './markers'
import type { StandardScenario } from './markers.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('markers', () => {
  scenario('returns all markers', async (scenario: StandardScenario) => {
    const result = await markers()

    expect(result.length).toEqual(Object.keys(scenario.marker).length)
  })

  scenario('returns a single marker', async (scenario: StandardScenario) => {
    const result = await marker({ id: scenario.marker.one.id })

    expect(result).toEqual(scenario.marker.one)
  })

  scenario('creates a marker', async () => {
    const result = await createMarker({
      input: {
        lat: 7447118.434893616,
        lng: 427548.3303651484,
        updatedAt: '2023-02-21T16:25:38.644Z',
      },
    })

    expect(result.lat).toEqual(7447118.434893616)
    expect(result.lng).toEqual(427548.3303651484)
    expect(result.updatedAt).toEqual(new Date('2023-02-21T16:25:38.644Z'))
  })

  scenario('updates a marker', async (scenario: StandardScenario) => {
    const original = (await marker({ id: scenario.marker.one.id })) as Marker
    const result = await updateMarker({
      id: original.id,
      input: { lat: 3695380.7621387737 },
    })

    expect(result.lat).toEqual(3695380.7621387737)
  })

  scenario('deletes a marker', async (scenario: StandardScenario) => {
    const original = (await deleteMarker({
      id: scenario.marker.one.id,
    })) as Marker
    const result = await marker({ id: original.id })

    expect(result).toEqual(null)
  })
})
