import { useEffect } from 'react'

import { Form, SlideModal } from '@ui'
import { FieldType } from '@ui/enums'
import { useTranslation } from 'react-i18next'
import { Problem } from 'types/graphql'

import { RWGqlError, useForm } from '@redwoodjs/forms'

import { TranslationKeys } from 'src/i18n'

export type ProblemForm = {
  title: string
}

export type ProblemModalProps = {
  problem?: Problem
  onSubmit?: (values: ProblemForm) => Promise<void>
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  afterModalClose?: () => void
  isLoading?: boolean
  error?: RWGqlError
  reset?: () => void
}

type IForm = ProblemForm

const ProblemModal = ({
  problem,
  onSubmit,
  isOpen,
  setIsOpen,
  afterModalClose,
  error,
  isLoading,
  reset,
}: ProblemModalProps) => {
  const { t } = useTranslation()
  const getDefaultValues = (): ProblemForm => {
    return {
      title: problem?.title || '',
    }
  }

  const formMethods = useForm<ProblemForm>({
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    formMethods.reset(getDefaultValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem])

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
        problem
          ? t(TranslationKeys.edit_problem)
          : t(TranslationKeys.create_problem)
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
          validation={{ required: true }}
        />
      </Form.Wrapper>
    </SlideModal>
  )
}

export default ProblemModal
