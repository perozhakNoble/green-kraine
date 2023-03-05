import { ReactElement, SyntheticEvent, useState } from 'react'

import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { Button, Form, Spinner, ToastContent } from '@ui'
import { FieldType } from '@ui/enums'
import { OptionTypeValue } from '@ui/types'
import { H4, H7 } from '@ui/Typography'
import {
  CreateProblemWithMarker,
  CreateProblemWithMarkerVariables,
  GetCategoriesAsOptions,
  GetKeywordsAsOptions,
} from 'types/graphql'

import { Controller, FieldError, useForm } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { renderer as clustererRenderer } from 'src/components/map/Clusterer'
import Map from 'src/components/map/Map'

export const CATEGORIES_QUERY_AS_OPTIONS = gql`
  query GetCategoriesAsOptions {
    options: categories {
      value: id
      label: name
    }
  }
`

export const KEYWORDS_QUERY_AS_OPTIONS = gql`
  query GetKeywordsAsOptions {
    options: keywords {
      value: title
      label: title
    }
  }
`

export const CREATE_NEW_PROBLEM_WITH_MARKER_MUTATION = gql`
  mutation CreateProblemWithMarker($input: CreateProblemWithMarkerInput!) {
    createProblemWithMarker(input: $input) {
      id
    }
  }
`

export type NewMarkerType = {
  lat: number
  lng: number
  isNew?: boolean
  isPending?: boolean
}

export type InformNewProblemForm = {
  title: string
  description: string
  category: OptionTypeValue
  severity: number
  keywords: string[]
  marker: NewMarkerType
}

type IForm = InformNewProblemForm

const InformNewProblemPage = () => {
  const { data: categoryData } = useQuery<GetCategoriesAsOptions>(
    CATEGORIES_QUERY_AS_OPTIONS
  )

  const { data: keywordsData } = useQuery<GetKeywordsAsOptions>(
    KEYWORDS_QUERY_AS_OPTIONS
  )

  const [createProblem, { loading, error }] =
    useMutation<CreateProblemWithMarker>(
      CREATE_NEW_PROBLEM_WITH_MARKER_MUTATION
    )

  const [newMarker, setNewMarker] = useState<NewMarkerType>(null)

  const formMethods = useForm<IForm>({
    defaultValues: {},
  })

  const onSubmitNewProblem = async (values: IForm) => {
    const newProblem = await createProblem({
      variables: {
        input: {
          description: values.description,
          keywords: values.keywords,
          marker: {
            lat: values.marker.lat,
            lng: values.marker.lng,
          },
          severity: values.severity,
          title: values.title,
          categoryId: values.category,
        },
      } as CreateProblemWithMarkerVariables,
    })

    navigate(
      routes.userReports({
        id: newProblem?.data?.createProblemWithMarker?.id,
      })
    )
  }

  const categoryOptions = categoryData?.options || []
  const keywordsOptions = keywordsData?.options || []

  const onClick = (e: google.maps.MapMouseEvent) => {
    if (formMethods.watch('marker') || (newMarker && !newMarker.isPending))
      return

    const newPendingMarker = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      isNew: true,
      isPending: true,
    }

    setNewMarker(newPendingMarker)
  }

  const renderMap = (status: Status): ReactElement => {
    if (status === Status.FAILURE) return <>Error</>
    return <Spinner />
  }

  const handleSubmitPendingMarker = async (e?: SyntheticEvent) => {
    e.preventDefault()
    try {
      const pendingMarker = newMarker

      await toast.promise(
        // eslint-disable-next-line
      new Promise(async (resolve, reject) => {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pendingMarker.lat},${pendingMarker.lng}&key=${process.env.GOOGLE_MAP_KEY}`
          )
          const json = await response.json()

          const isUkraine = json?.results?.some?.(
            (res) =>
              res.types?.some((t) => t === 'country') &&
              res.address_components?.some((adr) => adr.short_name === 'UA')
          )

          isUkraine ? resolve(true) : reject(false)
        }),
        {
          loading: (
            <ToastContent
              type="loading"
              text="Перевіряється коректність мітки"
            />
          ),
          error: (
            <ToastContent
              type="error"
              text="Мітка в даному регіоні тимчасово недоступна"
            />
          ),
          success: <ToastContent type="success" text="Мітку успішно додано" />,
        }
      )

      pendingMarker.isPending = false

      formMethods.setValue('marker', pendingMarker, { shouldValidate: true })
      setNewMarker(pendingMarker)
    } catch (_err) {
      console.warn(_err)
    }
  }

  const handleСancelPendingMarker = (e?: SyntheticEvent) => {
    e?.preventDefault()
    setNewMarker(null)
  }

  const handleCancelNewMarker = (e?: SyntheticEvent) => {
    e?.preventDefault()

    setNewMarker(null)
    formMethods.setValue('marker', undefined)
    formMethods.resetField('marker')
  }

  return (
    <>
      <MetaTags
        title="Нова еко-проблема"
        description="Inform New Problem page"
      />

      <H4 className="mx-6 mt-4">Проінформувати про нову екологічну проблему</H4>

      <div className="flex w-screen items-start justify-center">
        <Form.Wrapper
          formMethods={formMethods}
          onSubmit={onSubmitNewProblem}
          className="m-4 w-full lg:max-w-2xl"
          error={error}
          loading={loading}
        >
          <Form.Field<IForm>
            name="title"
            type={FieldType.text}
            validation={{ required: true }}
            placeholder="Короткий опис"
            label="Короткий опис"
          />
          <Form.Field<IForm>
            name="description"
            type={FieldType.textarea}
            validation={{ required: true }}
            placeholder="Опис"
            label="Опис"
          />
          <Form.Field<IForm>
            name="category"
            type={FieldType.select}
            options={categoryOptions}
            validation={{ required: true }}
            placeholder="Виберіть категорію"
            label="Категорія"
          />
          <Form.Field<IForm>
            name="severity"
            label="Важливість"
            placeholder="Важливість"
            type={FieldType.number}
            validation={{
              required: true,
              min: { value: 1, message: 'Мінімальне значення 1' },
              max: { value: 10, message: 'Максимальне значення 1' },
            }}
          />
          <Form.Field<IForm>
            name="keywords"
            label="Ключові слова"
            placeholder="Ключові слова"
            type={FieldType.select}
            options={keywordsOptions}
            isMulti
            validation={{
              required: true,
            }}
          />
          <H7 className="text-sm font-normal text-primary">Мітка</H7>
          <Wrapper apiKey={process.env.GOOGLE_MAP_KEY} render={renderMap}>
            <Map
              onClick={onClick}
              style={{ flexGrow: '1', height: '800px', width: '100%' }}
              fullscreenControl={false}
              clustererRenderer={clustererRenderer}
              markers={[newMarker].filter(Boolean)}
            />
          </Wrapper>
          {(newMarker?.isPending || newMarker?.isNew) && (
            <>
              <div className="flex justify-end gap-2">
                {newMarker?.isPending && newMarker?.isNew ? (
                  <>
                    <Button
                      type="button"
                      text="Додати мітку"
                      size="sm"
                      onClick={handleSubmitPendingMarker}
                    />
                    <Button
                      type="button"
                      text="Відмінити мітку"
                      color="secondary"
                      size="sm"
                      onClick={handleСancelPendingMarker}
                    />
                  </>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    text="Видалити додану мітку"
                    color="error"
                    onClick={handleCancelNewMarker}
                  />
                )}
              </div>
              <hr />
            </>
          )}
          <Controller
            name="marker"
            control={formMethods.control}
            rules={{
              required: 'Мітка обовʼязкова',
            }}
            render={({ field }) => (
              <input
                {...field}
                type="hidden"
                value={
                  formMethods.watch('marker') &&
                  !formMethods.watch('marker').isPending
                    ? JSON.stringify(formMethods.watch('marker'))
                    : ''
                }
                onChange={() => null}
              />
            )}
          />
          <FieldError name="marker" className="text-xs font-light text-error" />
        </Form.Wrapper>
      </div>
    </>
  )
}

export default InformNewProblemPage
