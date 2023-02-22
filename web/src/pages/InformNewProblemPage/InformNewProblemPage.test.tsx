import { render } from '@redwoodjs/testing/web'

import InformNewProblemPage from './InformNewProblemPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('InformNewProblemPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<InformNewProblemPage />)
    }).not.toThrow()
  })
})
