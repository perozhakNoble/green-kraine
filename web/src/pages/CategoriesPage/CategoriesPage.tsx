import { MetaTags } from '@redwoodjs/web'

import Categories from 'src/components/Categories/Categories'

const CategoriesPage = () => {
  return (
    <>
      <MetaTags title="Categories" description="Categories page" />
      <Categories />
    </>
  )
}

export default CategoriesPage
