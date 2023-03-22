import { render } from '@redwoodjs/testing/web'

import NewsPage from './NewsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('NewsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewsPage />)
    }).not.toThrow()
  })
})
