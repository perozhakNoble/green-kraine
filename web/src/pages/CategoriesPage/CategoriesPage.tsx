import { useTranslation } from 'react-i18next'

import { MetaTags } from '@redwoodjs/web'

import Categories from 'src/components/Categories/Categories'
import { TranslationKeys } from 'src/i18n'

const CategoriesPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <MetaTags
        title={t(TranslationKeys.categories)}
        description="Categories page"
      />
      <Categories />
    </>
  )
}

export default CategoriesPage
