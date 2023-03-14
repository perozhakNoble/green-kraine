import { render } from '@redwoodjs/testing/web'

import ProblemsPage from './ProblemsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ProblemsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProblemsPage />)
    }).not.toThrow()
  })
})
