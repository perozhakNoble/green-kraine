import { Fragment, ReactNode } from 'react'

import { Popover, Transition } from '@headlessui/react'
export type PopoverProps = {
  title: string | ReactNode
  className?: string
  children: (close: { close: () => void }) => ReactNode
  onOpen: () => void
}
export default function CustomPopover({
  title,
  className,
  children,
  onOpen,
}: PopoverProps) {
  return (
    <div className={`${className ?? ''}  `}>
      <Popover className="">
        {({ open, close }) => (
          <>
            <Popover.Button
              onClick={onOpen}
              className={`text-secondary
                ${open ? 'text-opacity-90' : ''} cursor-pointer`}
            >
              <span className="text-primary_dark text-xs font-light">
                {title}
              </span>
            </Popover.Button>
            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 mt-3 transform">
                <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-white p-4">
                    {children({ close })}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
