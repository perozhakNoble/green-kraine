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

  scenario('creates a marker', async (scenario: StandardScenario) => {
    const result = await createMarker({
      input: {
        lat: 8402272.635397276,
        lng: 5462670.621480357,
        userId: scenario.marker.two.userId,
      },
    })

    expect(result.lat).toEqual(8402272.635397276)
    expect(result.lng).toEqual(5462670.621480357)
    expect(result.userId).toEqual(scenario.marker.two.userId)
  })

  scenario('updates a marker', async (scenario: StandardScenario) => {
    const original = (await marker({ id: scenario.marker.one.id })) as Marker
    const result = await updateMarker({
      id: original.id,
      input: { lat: 9966396.353167025 },
    })

    expect(result.lat).toEqual(9966396.353167025)
  })

  scenario('deletes a marker', async (scenario: StandardScenario) => {
    const original = (await deleteMarker({
      id: scenario.marker.one.id,
    })) as Marker
    const result = await marker({ id: original.id })

    expect(result).toEqual(null)
  })
})
