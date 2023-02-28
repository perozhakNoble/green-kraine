/* eslint-disable @typescript-eslint/no-explicit-any */
import classnames from 'classnames'

import { DEFAULT_FORM_BUTTON_TEXTS } from 'src/constants'

import Spinner from '../Spinner'

export interface ButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'dark' | 'warning' | 'error'
  text: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  depth?: 'sm' | 'lg' | 'none'
  isLoading?: boolean
  onClick: any
  disabled?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit'
}

const Button = ({
  size = 'md',
  color = 'primary',
  iconPosition = 'left',
  depth = 'none',
  text,
  icon,
  isLoading,
  disabled = false,
  rounded = 'xl',
  onClick,
  type,
}: ButtonProps) => {
  const buttonClass = classnames({
    'inline-flex items-center justify-center my-auto font-normal cursor-pointer border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all':
      true,
    'px-1.5 py-1 text-[10px] rounded-lg': size === 'xs',
    'rounded-sm': rounded === 'sm',
    'rounded-md': rounded === 'md',
    'rounded-lg': rounded === 'lg',
    'rounded-xl': rounded === 'xl',
    'px-2.5 py-1.5 text-xs': size === 'sm',
    'px-3 py-2 text-sm': size === 'md',
    'px-6 py-3 text-base': size === 'lg',
    'pointer-events-none': isLoading,
    'bg-primary focus:ring-primary enabled:hover:bg-primary-light text-white':
      color === 'primary',
    'bg-white border-[1px] border-primary-dark focus:ring-primary text-primary enabled:hover:text-primary-light enabled:hover:border-primary-light':
      color === 'secondary',
    'bg-secondary-light focus:ring-secondary enabled:hover:bg-stone-300 text-secondary':
      color === 'dark',
    'bg-error-light focus:ring-error enabled:hover:bg-red-200 text-error':
      color === 'error',
    'bg-warning-light focus:ring-warning enabled:hover:bg-amber-300 text-warning':
      color === 'warning',
    'shadow-sm': depth === 'sm',
    'shadow-lg': depth === 'lg',
    'opacity-80 cursor-default': disabled,
  })
  return (
    <>
      {isLoading ? (
        <button className={buttonClass} disabled={disabled}>
          <div className="mr-2">
            <Spinner size="sm" />
          </div>
          {DEFAULT_FORM_BUTTON_TEXTS.LOADING}
        </button>
      ) : text !== '' ? (
        <button
          className={buttonClass}
          onClick={onClick}
          disabled={disabled}
          type={type}
        >
          {icon && iconPosition === 'left' && (
            <div className="mr-2">{icon}</div>
          )}
          <div>{text}</div>
          {icon && iconPosition === 'right' && (
            <div className="ml-2">{icon}</div>
          )}
        </button>
      ) : (
        <button
          className={buttonClass}
          onClick={onClick}
          disabled={disabled}
          type={type}
        >
          {icon}
        </button>
      )}
    </>
  )
}

export default Button
