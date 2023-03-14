import { Form, SlideModal } from '@ui'
import { FieldType } from '@ui/enums'
import { useTranslation } from 'react-i18next'

import { RWGqlError, useForm } from '@redwoodjs/forms'

import { TranslationKeys } from 'src/i18n'

export type UserResetPassForm = {
  password: string
}

export type UserResetPassModalProps = {
  onSubmit?: (values: UserResetPassForm) => Promise<void>
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  afterModalClose?: () => void
  isLoading?: boolean
  error?: RWGqlError
  reset?: () => void
}

type IForm = UserResetPassForm

const UserResetPasswordModal = ({
  onSubmit,
  isOpen,
  setIsOpen,
  afterModalClose,
  error,
  isLoading,
  reset,
}: UserResetPassModalProps) => {
  const { t } = useTranslation()

  const getDefaultValues = (): UserResetPassForm => {
    return {
      password: '',
    }
  }

  const formMethods = useForm<UserResetPassForm>({
    defaultValues: getDefaultValues(),
  })

  const handleReset = () => {
    setIsOpen(false)
    formMethods.reset()
    reset()
  }

  return (
    <SlideModal
      open={isOpen}
      setClosed={() => setIsOpen(false)}
      title={t(TranslationKeys.reset_password)}
      afterModalClose={() => {
        afterModalClose()
        handleReset()
      }}
    >
      <Form.Wrapper
        formMethods={formMethods}
        onSubmit={onSubmit}
        reset={handleReset}
        error={error}
        loading={isLoading}
      >
        <Form.Field<IForm>
          name="password"
          label={t(TranslationKeys.password)}
          placeholder={t(TranslationKeys.password)}
          type={FieldType.text}
          validation={{
            required: true,
          }}
        />
      </Form.Wrapper>
    </SlideModal>
  )
}

export default UserResetPasswordModal
