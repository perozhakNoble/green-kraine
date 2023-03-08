import { render } from '@redwoodjs/testing/web'

import CategoriesPage from './CategoriesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('CategoriesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CategoriesPage />)
    }).not.toThrow()
  })
})
