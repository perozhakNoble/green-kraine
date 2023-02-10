/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, ReactNode } from 'react'

// import { faTimes } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, Transition } from '@headlessui/react'
import classnames from 'classnames'

export interface SlideOverModalProps {
  justified?: 'left' | 'right'
  title?: string
  children: ReactNode
  open: boolean
  setClosed: () => void
  withoutAnimation?: boolean
  afterModalClose?: () => void
  width?:
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | 'full'
}

const SlideOverModal = ({
  justified = 'right',
  title,
  open,
  setClosed,
  width = 'md',
  withoutAnimation = false,
  children,
  afterModalClose,
}: SlideOverModalProps) => {
  const panelClass = classnames({
    'fixed inset-y-0 max-w-full flex': true,
    'right-0 pl-10': justified === 'right',
    'left-0 pr-10': justified === 'left',
  })
  const animationClass = classnames({
    '': withoutAnimation,
    'transform transition ease-in-out duration-200 sm:duration-400':
      !withoutAnimation,
  })
  const widthClass = classnames({
    'w-screen': true,
    'max-w-sm': width === 'sm',
    'max-w-md': width === 'md',
    'max-w-lg': width === 'lg',
    'max-w-xl': width === 'xl',
    'max-w-2xl': width === '2xl',
    'max-w-3xl': width === '3xl',
    'max-w-4xl': width === '4xl',
    'max-w-5xl': width === '5xl',
    'max-w-6xl': width === '6xl',
    'max-w-7xl': width === '7xl',
    'max-w-full': width === 'full',
  })
  const enterFrom =
    justified === 'right' ? 'translate-x-full' : '-translate-x-full'
  const enterTo = justified === 'right' ? 'translate-x-0' : '-translate-x-0'
  const leaveFrom = justified === 'right' ? 'translate-x-0' : '-translate-x-0'
  const leaveTo =
    justified === 'right' ? 'translate-x-full' : '-translate-x-full'

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-hidden"
        onClose={setClosed}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0 bg-black opacity-25" />

          <div className={panelClass}>
            <Transition.Child
              as={Fragment}
              enter={animationClass}
              enterFrom={enterFrom}
              enterTo={enterTo}
              leave={animationClass}
              leaveFrom={leaveFrom}
              leaveTo={leaveTo}
              afterLeave={afterModalClose}
            >
              <div className={widthClass}>
                <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                  <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-2xl text-primary">
                          {title}
                        </Dialog.Title>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default SlideOverModal
