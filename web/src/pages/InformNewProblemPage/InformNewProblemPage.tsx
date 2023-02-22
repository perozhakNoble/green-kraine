import { Form } from '@ui'
import { FieldType } from '@ui/enums'
import { OptionTypeValue } from '@ui/types'
import { H4 } from '@ui/Typography'
import { GetCategoriesAsOptions } from 'types/graphql'

import { useForm } from '@redwoodjs/forms'
import { MetaTags, useQuery } from '@redwoodjs/web'

export const CATEGORIES_QUERY_AS_OPTIONS = gql`
  query GetCategoriesAsOptions {
    options: categories {
      value: id
      label: name
    }
  }
`

export type InformNewProblemForm = {
  title: string
  description: string
  category: OptionTypeValue
}

type IForm = InformNewProblemForm

const InformNewProblemPage = () => {
  const { data: categoryData } = useQuery<GetCategoriesAsOptions>(
    CATEGORIES_QUERY_AS_OPTIONS
  )

  const formMethods = useForm({
    defaultValues: {},
  })

  const onSubmitNewProblem = async (values: IForm) => {
    console.log('values', values)
  }

  const categoryOptions = categoryData?.options || []

  return (
    <>
      <MetaTags
        title="Нова еко-проблема"
        description="Inform New Problem page"
      />

      <H4 className="mx-6 mt-4">Проінформувати про нову екологічну проблему</H4>

      <Form.Wrapper
        formMethods={formMethods}
        onSubmit={onSubmitNewProblem}
        className="m-4 max-w-lg"
      >
        <Form.Field<IForm>
          name="title"
          type={FieldType.text}
          placeholder="Короткий опис"
          label="Короткий опис"
        />
        <Form.Field<IForm>
          name="description"
          type={FieldType.textarea}
          placeholder="Опис"
          label="Опис"
        />
        <Form.Field<IForm>
          name="category"
          type={FieldType.select}
          options={categoryOptions}
          placeholder="Виберіть категорію"
          label="Категорія"
        />
      </Form.Wrapper>
    </>
  )
}

export default InformNewProblemPage
