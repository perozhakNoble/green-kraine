import { Button } from '@ui'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
const UserReportsPage = () => {
  const { logOut } = useAuth()
  return (
    <>
      <MetaTags title="UserReports" description="UserReports page" />

      <h1>UserReportsPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/UserReportsPage/UserReportsPage.tsx</code>
      </p>
      <p>
        My default route is named <code>userReports</code>, link to me with `
        <Link to={routes.userReports()}>UserReports</Link>`
      </p>
      <Button text="Log out" onClick={logOut} />
    </>
  )
}

export default UserReportsPage
