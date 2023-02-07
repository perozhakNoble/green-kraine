import classNames from 'classnames'

import { DEFAULT_TOAST_HEADERS } from 'src/constants'

export type IToastContentProps = {
  header?: string
  text: string
  type: 'loading' | 'error' | 'success'
}

const ToastContent = ({
  header: headerFromProps = '',
  text,
  type,
}: IToastContentProps) => {
  const header =
    headerFromProps ||
    (type === 'loading'
      ? DEFAULT_TOAST_HEADERS.LOADING
      : type === 'error'
      ? DEFAULT_TOAST_HEADERS.ERROR
      : DEFAULT_TOAST_HEADERS.SUCCESS)

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
