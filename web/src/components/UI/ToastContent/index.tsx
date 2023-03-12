import { ReactNode } from 'react'

import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import { TranslationKeys } from 'src/i18n'

export type ToastContentProps = {
  header?: string
  text: string | ReactNode
  type: 'loading' | 'error' | 'success'
}

const ToastContent = ({
  header: headerFromProps = '',
  text,
  type,
}: ToastContentProps) => {
  const { t } = useTranslation()

  const header =
    headerFromProps ||
    (type === 'loading'
      ? t(TranslationKeys.loading) + '..'
      : type === 'error'
      ? t(TranslationKeys.error) + '('
      : t(TranslationKeys.success) + '!')

  const headerClass = classNames({
    'text-sm font-medium': true,
    'text-green-500': type === 'success',
    'text-red-600': type === 'error',
    'text-stone-600': type === 'loading',
  })

  const textClass = classNames({
    'text-sm font-light': true,
    'mt-1': header,
  })

  return (
    <div className="w-64 p-2  ">
      {header && <div className={headerClass}>{header}</div>}
      <div className={textClass}>{text}</div>
    </div>
  )
}

export default ToastContent
