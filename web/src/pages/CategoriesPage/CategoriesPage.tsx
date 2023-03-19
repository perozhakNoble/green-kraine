import { H4 } from '@ui/Typography'
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
      <H4 className="mx-6 mt-4">{t(TranslationKeys.categories)}</H4>
      <Categories />
    </>
  )
}

export default CategoriesPage
