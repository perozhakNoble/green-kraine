import { render } from '@redwoodjs/testing/web'

import MarkerInfoDialog from './MarkerInfoDialog'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('MarkerInfoDialog', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MarkerInfoDialog marker={{}} onClose={() => null} open={false} />)
    }).not.toThrow()
  })
})
