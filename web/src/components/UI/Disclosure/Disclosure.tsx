import { Disclosure as ReactDisclosure, Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface CustomDisclosureProps {
  title: string | JSX.Element
  children: React.ReactNode
  editButton?: React.ReactNode
  buttonIcon?: React.ReactNode
  buttonChild?: React.ReactNode
  buttonTextColor?: 'text-primary' | 'text-secondary' | 'text-primary-dark'
  buttonFontSize?: 'text-xs' | 'text-sm' | 'text-md' | 'text-lg'
  buttonFontWeight?: 'font-light' | 'font-normal' | 'font-semibold'
  onClickToClose?: any
  onClickToOpen?: any
}

const Disclosure = ({
  title,
  children,
  editButton,
  buttonIcon,
  buttonChild,
  buttonTextColor = 'text-primary',
  buttonFontSize = 'text-sm',
  buttonFontWeight = 'font-light',
  onClickToClose,
  onClickToOpen,
}: CustomDisclosureProps) => {
  return (
    <ReactDisclosure as="div" className="mt-2">
      {({ open }) => (
        <>
          <div className="flex">
            <ReactDisclosure.Button
              className={`flex ${buttonChild ? `flex-col` : `items-center`}`}
              onClick={() => {
                if (onClickToClose && onClickToOpen) {
                  open ? onClickToClose() : onClickToOpen()
                }
              }}
            >
              {buttonChild ? (
                <>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className={`${
                        open ? 'rotate-90 transform' : ''
                      } mt-0.5 mr-1 h-4 w-4 text-secondary transition duration-75`}
                    />
                    <span
                      className={`${buttonFontSize} ${buttonFontWeight} ${buttonTextColor}`}
                    >
                      {title}
                    </span>
                    {buttonIcon ? (
                      <span className="ml-2">{buttonIcon}</span>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <div className="mr-1"></div>
                    <div className="pl-5">{buttonChild}</div>
                  </div>
                </>
              ) : (
                <>
                  <ChevronRightIcon
                    className={`${
                      open ? 'rotate-90 transform' : ''
                    } mt-0.5 mr-1 h-4 w-4 text-secondary transition duration-75`}
                  />
                  <span className={`text-sm font-light ${buttonTextColor}`}>
                    {title}
                  </span>
                  {buttonIcon ? (
                    <span className="ml-2">{buttonIcon}</span>
                  ) : null}
                </>
              )}
            </ReactDisclosure.Button>
            {editButton && editButton}
          </div>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <ReactDisclosure.Panel
              className="pt-2 pb-2 text-sm text-gray-500"
              static
            >
              {children}
            </ReactDisclosure.Panel>
          </Transition>
        </>
      )}
    </ReactDisclosure>
  )
}

export default Disclosure
