import { render } from '@redwoodjs/testing/web'

import KeywordsPage from './KeywordsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('KeywordsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<KeywordsPage />)
    }).not.toThrow()
  })
})
