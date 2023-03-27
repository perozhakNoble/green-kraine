import { useEffect } from 'react'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { Dialog, Form, Spinner, ToastContent } from '@ui'
import { FieldType } from '@ui/enums'
import { H4, H7 } from '@ui/Typography'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetMarkersVariables,
  Marker,
} from 'types/graphql'

import { useForm } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import LikeUnlikeButtons from 'src/components/map/LikeUnlikeButtons/LikeUnlikeButtons'
import { getLanguageLocaleFromLocalStorage } from 'src/hooks/useLanguageLocaleStorage'
import { TranslationKeys } from 'src/i18n'
import { MARKERS_QUERY } from 'src/pages/HomePage/HomePage'

type MarkerInfoDialogCommentForm = {
  content: string
}

type IForm = MarkerInfoDialogCommentForm

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
    }
  }
`

const MarkerInfoDialog = ({
  open,
  onClose,
  afterModalClose,
  marker,
  userId,
  filtersForRefetch,
}: {
  open: boolean
  onClose: () => void
  afterModalClose?: () => void
  marker: Partial<Marker>
  userId?: string
  filtersForRefetch?: any
}) => {
  const { t } = useTranslation()
  const { currentUser } = useAuth()

  const formMethods = useForm<MarkerInfoDialogCommentForm>()

  const [createComment, { loading }] = useMutation<CreateCommentMutation>(
    CREATE_COMMENT_MUTATION,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: MARKERS_QUERY,
          variables: {
            userId,
            filters: filtersForRefetch,
          } as GetMarkersVariables,
        },
      ],
    }
  )

  useEffect(() => {
    formMethods.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker?.id])

  const submitComment = async (values: MarkerInfoDialogCommentForm) => {
    if (!values.content) return

    if (!currentUser) {
      toast.error(
        <ToastContent
          type="error"
          text={t(TranslationKeys.comments_available_only_for_logged_users)}
        />
      )
    }

    const variables: CreateCommentMutationVariables = {
      input: {
        content: values.content,
        problemId: marker.problem?.id,
        userId: currentUser.id,
      },
    }

    await createComment({
      variables,
    })

    formMethods.reset()
  }

  return (
    <Dialog open={open} onClose={onClose} afterModalClose={afterModalClose}>
      <div>
        <H4>{marker?.problem?.title}</H4>
        <div className="text-md font-light">
          <p>
            <b>{t(TranslationKeys.author)}: </b>
            {marker?.user?.name}
          </p>
          <p>
            <b>{t(TranslationKeys.category)}: </b>
            {marker?.problem?.category.name}
          </p>
          <p>
            <b>{t(TranslationKeys.problem)}: </b>
            {marker?.problem?.description}
          </p>
          <p>
            <b>{t(TranslationKeys.severity)}: </b>
            {marker?.problem?.severity}
          </p>
          {marker?.problem?.keywords?.length && (
            <p>
              <b>{t(TranslationKeys.key_words)}: </b>
              {marker?.problem?.keywords
                ?.map((keyword) => keyword.title)
                .join(', ')}
            </p>
          )}
        </div>
        <div className="mt-2 ml-auto mr-2 w-20">
          <LikeUnlikeButtons
            votes={marker?.problem?.votes}
            problemId={marker?.problem?.id}
            userId={userId}
            filtersForRefetch={filtersForRefetch}
          />
        </div>
        <div className="my-2 flex flex-col items-center">
          {marker?.problem?.images.map((img) => (
            <img
              src={img.path}
              key={img.id}
              alt="problem"
              className="max-h-52 rounded-xl shadow-md"
            />
          ))}
        </div>
        <div className="max-h-80 w-full overflow-y-scroll">
          <div className="sticky top-0 w-full bg-white">
            <H7>{t(TranslationKeys.comments)}</H7>
            <div></div>
            <Form.Wrapper
              onSubmit={submitComment}
              formMethods={formMethods}
              withoutButtons
              className="px-1 pb-0.5"
            >
              <div className="relative">
                <Form.Field<IForm>
                  name="content"
                  type={FieldType.text}
                  withoutLabel
                  placeholder={t(TranslationKeys.leave_your_comment)}
                />
                <button className="absolute right-0 top-1 h-10 w-11 rounded-r-xl bg-primary hover:bg-primary-light">
                  {loading ? (
                    <div className="ml-3">
                      <Spinner color="text-white" size="sm" />
                    </div>
                  ) : (
                    <PaperAirplaneIcon className="ml-3.5 h-4 w-4 text-white" />
                  )}
                </button>
              </div>
            </Form.Wrapper>
          </div>
          {!!marker?.problem?.comments?.length && (
            <div className="mt-2 flex flex-col divide-y">
              {marker?.problem?.comments?.map((comment) => (
                <div key={comment.id} className="py-2">
                  <div className="flex items-start gap-x-2 text-xs font-light">
                    {comment.user?.name}
                    <span className="block text-[7px] font-extralight text-gray-500">
                      {DateTime.fromISO(comment.createdAt)
                        .setLocale(getLanguageLocaleFromLocalStorage())
                        .toFormat('yyyy LLL dd HH:mm')}
                    </span>
                  </div>
                  <div className="text-sm font-extralight">
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default MarkerInfoDialog
