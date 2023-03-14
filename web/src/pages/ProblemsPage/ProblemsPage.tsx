import { useTranslation } from 'react-i18next'

import { MetaTags } from '@redwoodjs/web'

import Problems from 'src/components/Problems/Problems'
import { TranslationKeys } from 'src/i18n'

const ProblemsPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <MetaTags
        title={t(TranslationKeys.eco_problems)}
        description="Problems page"
      />

      <Problems />
    </>
  )
}

export default ProblemsPage
