import { useEffect, useState } from 'react'

import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Form, LoadingState, Spinner } from '@ui'
import { FieldType } from '@ui/enums'
import { H4 } from '@ui/Typography'
import { useTranslation } from 'react-i18next'
import { GetUser } from 'types/graphql'

import { useForm } from '@redwoodjs/forms'
import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { TranslationKeys } from 'src/i18n'

const InfoItem = ({
  title,
  content,
  editable = '',
  update = (_a: any) => null,
  loading = false,
}) => {
  const [isEdit, setIsEdit] = useState(false)

  const formMethods = useForm({
    defaultValues: {
      [editable]: content,
    },
  })

  useEffect(() => {
    formMethods.reset({
      [editable]: content,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  const onSubmit = async (values: { [key: string]: string }): Promise<void> => {
    await update(values)
    setIsEdit(false)
  }

  return (
    <div className="py-1.5">
      <div className="text-md flex items-center">
        {title}
        {editable && (
          <FontAwesomeIcon
            icon={faPencil}
            className="ml-4 h-3 w-3 cursor-pointer text-gray-500"
            onClick={() => {
              setIsEdit(!isEdit)
            }}
          />
        )}
      </div>
      {isEdit ? (
        <Form.Wrapper
          formMethods={formMethods}
          onSubmit={onSubmit}
          withoutButtons
        >
          <div className="relative w-64">
            <Form.Field<any>
              name={editable}
              type={FieldType.text}
              withoutLabel
            />
            <button className="absolute right-0 top-1 h-10 w-11 rounded-r-xl bg-primary hover:bg-primary-light">
              {loading ? (
                <div className="ml-3">
                  <Spinner color="text-white" size="sm" />
                </div>
              ) : (
                <CheckIcon className="ml-3.5 h-4 w-4 text-white" />
              )}
            </button>
          </div>
        </Form.Wrapper>
      ) : (
        <div className="text-light text-sm text-gray-700">{content}</div>
      )}
    </div>
  )
}

export const GET_USER_QUERY = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      name
      roles
      email
      comments {
        id
      }
      votes {
        id
        upvote
      }
      problems {
        id
        status
      }
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserProfile($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
    }
  }
`

const ProfilePage = () => {
  const { t } = useTranslation()
  const { currentUser } = useAuth()

  const { data: userData, loading: loadingQuery } = useQuery<GetUser>(
    GET_USER_QUERY,
    {
      variables: {
        id: currentUser.id,
      },
    }
  )

  const [updateUser, updateUserOpts] = useMutation(UPDATE_USER_MUTATION, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_USER_QUERY,
        variables: {
          id: currentUser.id,
        },
      },
    ],
  })

  const loading = loadingQuery || updateUserOpts.loading

  return (
    <>
      <MetaTags title={t(TranslationKeys.profile)} description="Profile page" />

      <H4 className="mx-6 mt-4">{t(TranslationKeys.profile)}</H4>

      <LoadingState loading={loading} />

      <div className="flex flex-col divide-y px-6">
        <InfoItem
          title={t(TranslationKeys.name)}
          content={userData?.user?.name}
          editable={'name'}
          update={(v) => {
            updateUser({
              variables: {
                id: currentUser.id,
                input: {
                  ...v,
                },
              },
            })
          }}
          loading={loading}
        />
        <InfoItem
          title={t(TranslationKeys.role)}
          content={t(userData?.user?.roles)}
        />
        <InfoItem
          title={t(TranslationKeys.email)}
          content={userData?.user?.email}
        />
        <InfoItem
          title={t(TranslationKeys.comments_count)}
          content={userData?.user?.comments.length || 0}
        />
        <InfoItem
          title={t(TranslationKeys.p_votes_count)}
          content={userData?.user?.votes.filter((v) => v.upvote).length || 0}
        />
        <InfoItem
          title={t(TranslationKeys.n_votes_count)}
          content={userData?.user?.votes.filter((v) => !v.upvote).length || 0}
        />
        <InfoItem
          title={t(TranslationKeys.problems_reported)}
          content={userData?.user?.problems.length || 0}
        />
      </div>
    </>
  )
}

export default ProfilePage
