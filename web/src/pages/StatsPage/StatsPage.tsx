import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const StatsPage = () => {
  return (
    <>
      <MetaTags title="Stats" description="Stats page" />

      <h1>StatsPage</h1>
      <p>
        Find me in <code>./web/src/pages/StatsPage/StatsPage.tsx</code>
      </p>
      <p>
        My default route is named <code>stats</code>, link to me with `
        <Link to={routes.stats()}>Stats</Link>`
      </p>
    </>
  )
}

export default StatsPage
