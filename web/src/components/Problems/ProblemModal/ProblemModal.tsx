import { useEffect } from 'react'

import { Form, SlideModal } from '@ui'
import { FieldType } from '@ui/enums'
import { OptionTypeValue } from '@ui/types'
import { useTranslation } from 'react-i18next'
import {
  GetCategoriesAsOptions,
  GetKeywordsAsOptions,
  Problem,
} from 'types/graphql'

import { RWGqlError, useForm } from '@redwoodjs/forms'
import { useQuery } from '@redwoodjs/web'

import { GET_CATEGORIES_AS_OPTIONS } from 'src/components/Categories/Categories.graphql'
import { GET_KEYWORDS_AS_OPTIONS } from 'src/components/Keywords/Keywords.graphql'
import { TranslationKeys } from 'src/i18n'

export type ProblemForm = {
  title: string
  description: string
  category: OptionTypeValue
  severity: number
  keywords: string[]
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
      category: problem?.category?.id || '',
      description: problem?.description || '',
      keywords: problem?.keywords?.map((k) => k.id) || [],
      severity: problem?.severity || undefined,
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

  const { data: categoryData } = useQuery<GetCategoriesAsOptions>(
    GET_CATEGORIES_AS_OPTIONS
  )

  const { data: keywordsData } = useQuery<GetKeywordsAsOptions>(
    GET_KEYWORDS_AS_OPTIONS
  )
  const categoryOptions = categoryData?.options || []
  const keywordsOptions = keywordsData?.options || []

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
          type={FieldType.text}
          validation={{ required: true }}
          placeholder={t(TranslationKeys.short_description)}
          label={t(TranslationKeys.short_description)}
        />
        <Form.Field<IForm>
          name="description"
          type={FieldType.textarea}
          validation={{ required: true }}
          placeholder={t(TranslationKeys.description)}
          label={t(TranslationKeys.description)}
        />
        <Form.Field<IForm>
          name="category"
          type={FieldType.select}
          options={categoryOptions}
          validation={{ required: true }}
          placeholder={t(TranslationKeys.category)}
          label={t(TranslationKeys.category)}
        />
        <Form.Field<IForm>
          name="severity"
          label={t(TranslationKeys.severity)}
          placeholder={t(TranslationKeys.severity)}
          type={FieldType.number}
          validation={{
            required: true,
            min: { value: 1, message: `${t(TranslationKeys.min_value)} 1` },
            max: { value: 10, message: `${t(TranslationKeys.max_value)} 10` },
          }}
        />
        <Form.Field<IForm>
          name="keywords"
          label={t(TranslationKeys.key_words)}
          placeholder={t(TranslationKeys.key_words)}
          type={FieldType.select}
          options={keywordsOptions}
          isMulti
          validation={{
            required: true,
          }}
        />
      </Form.Wrapper>
    </SlideModal>
  )
}

export default ProblemModal
