import { render } from '@redwoodjs/testing/web'

import AppSidebar from './AppSidebar'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AppSidebar', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AppSidebar isOpen={true} setIsOpen={() => null} />)
    }).not.toThrow()
  })
})
