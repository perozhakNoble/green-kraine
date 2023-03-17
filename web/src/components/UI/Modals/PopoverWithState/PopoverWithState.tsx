import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react'

export type PopoverWithStateProps = {
  isOpen: boolean
  setIsOpen: (a: boolean) => void
  children: React.ReactNode
  trigger: React.ReactNode
  placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right'
}

const PopoverWithState = ({
  isOpen,
  setIsOpen,
  trigger,
  children,
  placement = 'left',
}: PopoverWithStateProps) => {
  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement={placement}
      closeOnBlur
      closeOnEsc
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <Portal>
        <PopoverContent
          width={'auto'}
          _focus={{
            outline: 'none',
          }}
        >
          <PopoverArrow />
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default PopoverWithState
