import type { Image } from '@prisma/client'

import { images, image, createImage, updateImage, deleteImage } from './images'
import type { StandardScenario } from './images.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('images', () => {
  scenario('returns all images', async (scenario: StandardScenario) => {
    const result = await images()

    expect(result.length).toEqual(Object.keys(scenario.image).length)
  })

  scenario('returns a single image', async (scenario: StandardScenario) => {
    const result = await image({ id: scenario.image.one.id })

    expect(result).toEqual(scenario.image.one)
  })

  scenario('creates a image', async () => {
    const result = await createImage({
      input: {
        filename: 'String',
        path: 'String',
        updatedAt: '2023-02-21T16:26:43.820Z',
      },
    })

    expect(result.filename).toEqual('String')
    expect(result.path).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-02-21T16:26:43.820Z'))
  })

  scenario('updates a image', async (scenario: StandardScenario) => {
    const original = (await image({ id: scenario.image.one.id })) as Image
    const result = await updateImage({
      id: original.id,
      input: { filename: 'String2' },
    })

    expect(result.filename).toEqual('String2')
  })

  scenario('deletes a image', async (scenario: StandardScenario) => {
    const original = (await deleteImage({ id: scenario.image.one.id })) as Image
    const result = await image({ id: original.id })

    expect(result).toEqual(null)
  })
})
