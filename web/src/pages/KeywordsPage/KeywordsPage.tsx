import { useTranslation } from 'react-i18next'

import { MetaTags } from '@redwoodjs/web'

import Keywords from 'src/components/Keywords/Keywords'
import { TranslationKeys } from 'src/i18n'

const KeywordsPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <MetaTags
        title={t(TranslationKeys.key_words)}
        description="Keywords page"
      />
      <Keywords />
    </>
  )
}

export default KeywordsPage
