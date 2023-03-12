import { useEffect } from 'react'

import { Form, SlideModal } from '@ui'
import { FieldType } from '@ui/enums'
import { useTranslation } from 'react-i18next'
import { Keyword } from 'types/graphql'

import { RWGqlError, useForm } from '@redwoodjs/forms'

import { TranslationKeys } from 'src/i18n'

export type KeywordForm = {
  title: string
}

export type KeywordModalProps = {
  keyword?: Keyword
  onSubmit?: (values: KeywordForm) => Promise<void>
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  afterModalClose?: () => void
  isLoading?: boolean
  error?: RWGqlError
  reset?: () => void
}

type IForm = KeywordForm

const KeywordModal = ({
  keyword,
  onSubmit,
  isOpen,
  setIsOpen,
  afterModalClose,
  error,
  isLoading,
  reset,
}: KeywordModalProps) => {
  const { t } = useTranslation()
  const getDefaultValues = (): KeywordForm => {
    return {
      title: keyword?.title || '',
    }
  }

  const formMethods = useForm<KeywordForm>({
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    formMethods.reset(getDefaultValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

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
        keyword
          ? t(TranslationKeys.edit_keyword)
          : t(TranslationKeys.create_keyword)
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
          name="title"
          label={t(TranslationKeys.title)}
          placeholder={t(TranslationKeys.title)}
          type={FieldType.text}
        />
      </Form.Wrapper>
    </SlideModal>
  )
}

export default KeywordModal
