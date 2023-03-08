import { useEffect } from 'react'

import { Form, SlideModal } from '@ui'
import { FieldType } from '@ui/enums'
import { Category } from 'types/graphql'

import { RWGqlError, useForm } from '@redwoodjs/forms'

export type CategoryForm = {
  name: string
}

export type CategoryModalProps = {
  category?: Category
  onSubmit?: (values: CategoryForm) => Promise<void>
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  afterModalClose?: () => void
  isLoading?: boolean
  error?: RWGqlError
  reset?: () => void
}

type IForm = CategoryForm

const CategoryModal = ({
  category,
  onSubmit,
  isOpen,
  setIsOpen,
  afterModalClose,
  error,
  isLoading,
  reset,
}: CategoryModalProps) => {
  const getDefaultValues = (): CategoryForm => {
    return {
      name: category?.name || '',
    }
  }

  const formMethods = useForm<CategoryForm>({
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    formMethods.reset(getDefaultValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const handleReset = () => {
    setIsOpen(false)
    formMethods.reset(getDefaultValues())
    reset()
  }

  return (
    <SlideModal
      open={isOpen}
      setClosed={() => setIsOpen(false)}
      title={category ? 'Редагування категорії' : 'Створення категорії'}
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
        <Form.Field<IForm> name="name" type={FieldType.text} />
      </Form.Wrapper>
    </SlideModal>
  )
}

export default CategoryModal
