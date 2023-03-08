import { render } from '@redwoodjs/testing/web'

import StatsPage from './StatsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('StatsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<StatsPage />)
    }).not.toThrow()
  })
})
