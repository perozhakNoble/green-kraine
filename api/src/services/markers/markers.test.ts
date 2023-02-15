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
        lat: 6211441.773102286,
        lng: 6585369.073345542,
        userId: scenario.marker.two.userId,
      },
    })

    expect(result.lat).toEqual(6211441.773102286)
    expect(result.lng).toEqual(6585369.073345542)
    expect(result.userId).toEqual(scenario.marker.two.userId)
  })

  scenario('updates a marker', async (scenario: StandardScenario) => {
    const original = (await marker({ id: scenario.marker.one.id })) as Marker
    const result = await updateMarker({
      id: original.id,
      input: { lat: 2781673.608657214 },
    })

    expect(result.lat).toEqual(2781673.608657214)
  })

  scenario('deletes a marker', async (scenario: StandardScenario) => {
    const original = (await deleteMarker({
      id: scenario.marker.one.id,
    })) as Marker
    const result = await marker({ id: original.id })

    expect(result).toEqual(null)
  })
})
