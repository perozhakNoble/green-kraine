import React, { createContext, ReactNode, useState } from 'react'

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faCheck,
  faPencilAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

import { Form, FormError, RWGqlError, UseFormReturn } from '@redwoodjs/forms'

import { TranslationKeys } from 'src/i18n'

import Button from '../../Button/Button'

export type IFormContext = {
  formMethods: UseFormReturn<any, any>
  mode: FormType
  isEdit: boolean
}

export enum FormType {
  previewOnly = 'preview',
  editOnly = 'edit',
  both = 'both',
}

export const FormContext = createContext<IFormContext>({
  formMethods: null,
  mode: FormType.editOnly,
  isEdit: false,
})

export type IFormWrapperProps<T> = {
  formMethods: UseFormReturn<T, any>
  children: ReactNode
  error?: RWGqlError
  submitBtnText?: string
  submitBtnIcon?: IconDefinition
  cancelBtnText?: string
  cancelBtnIcon?: IconDefinition
  disabled?: boolean
  loading?: boolean
  reset?: () => void
  className?: string
  mode?: FormType
  onSubmit: (values: T) => Promise<void>
  dontCloseEditAfterSubmit?: boolean
}

const FormWrapper = <T,>({
  children,
  error,
  mode = FormType.editOnly,
  submitBtnText,
  submitBtnIcon = faCheck,
  cancelBtnText,
  cancelBtnIcon = null,
  disabled = false,
  loading = false,
  reset,
  formMethods,
  className,
  onSubmit,
  dontCloseEditAfterSubmit = mode === FormType.editOnly,
}: IFormWrapperProps<T>) => {
  const { t } = useTranslation()

  const [isEdit, setIsEdit] = useState<boolean>(
    mode === FormType.editOnly ? true : false
  )

  const handleSubmit = async (values: any) => {
    await onSubmit(values)
    if (!dontCloseEditAfterSubmit) {
      setIsEdit(mode === FormType.editOnly)
    }
  }

  return (
    <Form
      formMethods={formMethods}
      onSubmit={handleSubmit}
      className={`${className ?? ''} relative`}
    >
      <FormContext.Provider
        value={{
          formMethods,
          mode,
          isEdit,
        }}
      >
        <div className="flex flex-col gap-2">
          {children}
          {!loading && !isEdit && (
            <FontAwesomeIcon
              icon={faPencilAlt as IconProp}
              className={
                'absolute right-3 top-3 cursor-pointer text-xs text-secondary'
              }
              onClick={() => setIsEdit(true)}
            />
          )}
        </div>
      </FormContext.Provider>
      <div className="mt-3 ml-2 text-sm font-light text-red-400">
        <FormError error={error} />
      </div>
      {isEdit && (
        <div className="mt-4 mb-1 flex gap-2">
          <Button
            text={submitBtnText ?? t(TranslationKeys.save)}
            isLoading={loading}
            disabled={disabled}
            icon={<FontAwesomeIcon icon={submitBtnIcon as IconProp} />}
            onClick={() => null}
            type="submit"
          />
          <Button
            text={cancelBtnText ?? t(TranslationKeys.cancel)}
            isLoading={false}
            disabled={false}
            type="button"
            icon={
              cancelBtnIcon && (
                <FontAwesomeIcon icon={cancelBtnIcon as IconProp} />
              )
            }
            onClick={() => {
              setIsEdit(mode === FormType.editOnly)
              formMethods.reset()
              reset && reset()
            }}
            color="dark"
          />
        </div>
      )}
    </Form>
  )
}

export default FormWrapper
