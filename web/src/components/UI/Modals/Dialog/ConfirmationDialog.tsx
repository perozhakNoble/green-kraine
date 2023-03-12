import { Dialog as ReactDialog } from '@headlessui/react'
import { useTranslation } from 'react-i18next'

import { TranslationKeys } from 'src/i18n'

import Button from '../../Button/Button'

import Dialog from './Dialog'

export type ConfirmationDialogProps = {
  close: () => void
  isOpen: boolean
  afterModalClose?: () => void
  confirm: () => void
  text: string
  loading?: boolean
  type: 'error' | 'primary' | 'warning'
  cancelBtnText?: string
  submitBtnText?: string
  header: string
}

const ConfirmationDialog = ({
  close,
  isOpen,
  confirm,
  afterModalClose,
  text,
  loading = false,
  cancelBtnText,
  submitBtnText,
  type = 'primary',
  header,
}: ConfirmationDialogProps) => {
  const { t } = useTranslation()

  return (
    <Dialog onClose={close} open={isOpen} afterModalClose={afterModalClose}>
      <div>
        <ReactDialog.Title
          as="h3"
          className={`text-lg font-bold leading-6 text-${type}`}
        >
          {header}
        </ReactDialog.Title>

        <div className={`mt-4 rounded-xl border-2 border-${type}-light p-4`}>
          <div className={`mb-3 text-sm font-semibold text-${type}`}>
            {text}
          </div>
          <div className="flex flex-wrap">
            <div className="mt-2 mr-3">
              <Button
                size="md"
                isLoading={loading}
                onClick={confirm}
                text={submitBtnText ?? t(TranslationKeys.save)}
                color={type}
              />
            </div>
            <div className="mt-2">
              <Button
                size="md"
                color="dark"
                onClick={close}
                text={cancelBtnText ?? t(TranslationKeys.cancel)}
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmationDialog
