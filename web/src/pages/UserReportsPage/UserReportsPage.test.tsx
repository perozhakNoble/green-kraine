import { render } from '@redwoodjs/testing/web'

import UserReportsPage from './UserReportsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('UserReportsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserReportsPage />)
    }).not.toThrow()
  })
})
