import React from 'react'

import Spinner from '@ui/Spinner'
import { useTranslation } from 'react-i18next'

import { TranslationKeys } from 'src/i18n'

const LoadingState = ({ loading }) => {
  const { t } = useTranslation()

  return (
    <div
      className={`absolute left-0 right-0 top-0 bottom-0 flex h-full flex-col items-center justify-center bg-white ${
        !loading
          ? 'scale-0 bg-opacity-0 opacity-0'
          : 'scale-100 bg-opacity-50  opacity-100'
      } transition-all `}
    >
      <div className="mb-2">{t(TranslationKeys.loading)}..</div>
      <Spinner size="lg" />
    </div>
  )
}

export default LoadingState
