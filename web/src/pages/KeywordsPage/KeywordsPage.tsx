import { H4 } from '@ui/Typography'
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
      <H4 className="mx-6 mt-4">{t(TranslationKeys.key_words)}</H4>
      <Keywords />
    </>
  )
}

export default KeywordsPage
