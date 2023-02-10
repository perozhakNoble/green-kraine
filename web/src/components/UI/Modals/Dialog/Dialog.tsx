import { Fragment } from 'react'

import { Dialog as ReactDialog, Transition } from '@headlessui/react'
import classnames from 'classnames'

export interface ModalProps {
  open: boolean
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  onClose?: () => void
  afterModalClose?: () => void
}

const Dialog = ({
  size,
  open,
  onClose,
  children,
  afterModalClose,
}: ModalProps) => {
  const modalClass = classnames({
    'flex items-end justify-center min-h-screen text-center sm:block sm:p-0':
      true,
    'px-2 py-2 text-xs': size === 'sm',
    'px-6 py-6 text-md': size === 'md',
    'px-8 py-8 text-lg': size === 'lg',
  })

  return (
    <Transition.Root appear show={open} as={Fragment}>
      <ReactDialog
        as="div"
        onClose={() => onClose()}
        className="fixed inset-0 z-[1000] overflow-y-auto"
      >
        <div className={modalClass}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ReactDialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            afterLeave={afterModalClose}
          >
            <div className="mx-2 my-auto inline-block w-full transform overflow-hidden rounded-xl bg-white p-6 px-4 pt-5 pb-4 text-left align-middle font-medium text-secondary shadow-xl transition-all sm:max-w-lg">
              {children}
            </div>
          </Transition.Child>
        </div>
      </ReactDialog>
    </Transition.Root>
  )
}

export default Dialog
