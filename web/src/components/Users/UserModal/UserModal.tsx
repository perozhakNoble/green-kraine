import { useEffect } from 'react'

import { Form, SlideModal } from '@ui'
import { FieldType } from '@ui/enums'
import { OptionTypeValue } from '@ui/types'
import { useTranslation } from 'react-i18next'
import { User } from 'types/graphql'

import { RWGqlError, useForm } from '@redwoodjs/forms'

import { UserRole } from 'src/constants'
import { TranslationKeys } from 'src/i18n'

export type UserForm = {
  name: string
  email: string
  roles: OptionTypeValue
  password?: string
}

export type UserModalProps = {
  user?: User
  onSubmit?: (values: UserForm) => Promise<void>
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  afterModalClose?: () => void
  isLoading?: boolean
  error?: RWGqlError
  reset?: () => void
}

type IForm = UserForm

const UserModal = ({
  user,
  onSubmit,
  isOpen,
  setIsOpen,
  afterModalClose,
  error,
  isLoading,
  reset,
}: UserModalProps) => {
  const { t } = useTranslation()

  const roleOptions = Object.values(UserRole)
    .filter((r) => r !== 'ADMIN')
    .map((r) => ({
      value: r,
      label: t(r),
    }))

  const getDefaultValues = (): UserForm => {
    return {
      name: user?.name || '',
      email: user?.email || '',
      roles: user?.roles || '',
      password: '',
    }
  }

  const formMethods = useForm<UserForm>({
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    formMethods.reset(getDefaultValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleReset = () => {
    setIsOpen(false)
    formMethods.reset()
    reset()
  }

  return (
    <SlideModal
      open={isOpen}
      setClosed={() => setIsOpen(false)}
      title={
        user ? t(TranslationKeys.edit_user) : t(TranslationKeys.create_user)
      }
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
          name="name"
          label={t(TranslationKeys.name)}
          placeholder={t(TranslationKeys.name)}
          type={FieldType.text}
          validation={{
            required: true,
          }}
        />
        <Form.Field<IForm>
          name="email"
          label={t(TranslationKeys.email)}
          placeholder={t(TranslationKeys.email)}
          type={FieldType.email}
          validation={{
            required: true,
          }}
        />
        <Form.Field<IForm>
          name="roles"
          label={t(TranslationKeys.role)}
          placeholder={t(TranslationKeys.role)}
          options={roleOptions}
          type={FieldType.select}
          validation={{
            required: true,
          }}
        />
        {!user && (
          <Form.Field<IForm>
            name="password"
            label={t(TranslationKeys.password)}
            placeholder={t(TranslationKeys.password)}
            type={FieldType.text}
            validation={{
              required: true,
            }}
          />
        )}
      </Form.Wrapper>
    </SlideModal>
  )
}

export default UserModal
