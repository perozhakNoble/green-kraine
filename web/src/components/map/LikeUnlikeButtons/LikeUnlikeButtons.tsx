import { useEffect, useState } from 'react'

import {
  faThumbsUp as LikeIconEmpty,
  faThumbsDown as DislikeIconEmpty,
} from '@fortawesome/free-regular-svg-icons'
import {
  faThumbsUp as LikeIconFull,
  faThumbsDown as DislikeIconFull,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Spinner, ToastContent } from '@ui'
import { useTranslation } from 'react-i18next'
import {
  RemoveVote,
  RemoveVoteVariables,
  UpsertVote,
  UpsertVoteVariables,
  Vote,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import { TranslationKeys } from 'src/i18n'
import { MARKERS_QUERY } from 'src/pages/HomePage/HomePage'

type LikeUnlikeButtonsProps = {
  votes: Vote[]
  problemId: string
  userId?: string
}

export const UPSERT_VOTE_MUTATION = gql`
  mutation UpsertVote($problemId: String!, $upvote: Boolean!) {
    upsertVote(problemId: $problemId, upvote: $upvote) {
      id
    }
  }
`

export const REMOVE_VOTE_MUTATION = gql`
  mutation RemoveVote($problemId: String!) {
    deleteVoteByProblemId(problemId: $problemId) {
      id
    }
  }
`

const LikeUnlikeButtons = ({
  votes,
  problemId,
  userId,
}: LikeUnlikeButtonsProps) => {
  const { currentUser } = useAuth()
  const { t } = useTranslation()

  const [upsertVote, { loading: loadingUpsertVote }] = useMutation<UpsertVote>(
    UPSERT_VOTE_MUTATION,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: MARKERS_QUERY,
          variables: {
            userId,
          },
        },
      ],
    }
  )

  const [removeVote, { loading: loadingRemoveVote }] = useMutation<RemoveVote>(
    REMOVE_VOTE_MUTATION,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: MARKERS_QUERY,
          variables: {
            userId,
          },
        },
      ],
    }
  )

  const [isBtnClicked, setIsBtnClicked] = useState<{ upvote: boolean }>(null)
  const likeClicked = isBtnClicked && isBtnClicked.upvote
  const unlikeClicked = isBtnClicked && !isBtnClicked.upvote

  useEffect(() => {
    if (!currentUser || !votes) {
      setIsBtnClicked(null)
      return
    }

    const vote = votes.find((vote) => vote.user.email === currentUser.email)
    if (vote) {
      setIsBtnClicked({ upvote: vote.upvote })
    }
  }, [votes, currentUser])

  const clickVote = (vote: 'like' | 'unlike') => {
    if (!currentUser)
      return toast.error(
        <ToastContent
          type="error"
          text={t(TranslationKeys.votes_available_only_for_logged_users)}
        />
      )

    if (
      (vote === 'like' && likeClicked) ||
      (vote === 'unlike' && unlikeClicked)
    ) {
      removeVote({
        variables: {
          problemId,
        } as RemoveVoteVariables,
      })
      setIsBtnClicked(null)

      return
    }
    upsertVote({
      variables: {
        problemId,
        upvote: vote === 'like',
      } as UpsertVoteVariables,
    })
    setIsBtnClicked({ upvote: vote === 'like' })
  }

  if (!votes) return <></>

  return (
    <div className="flex w-20 items-start gap-4">
      <span className="flex h-6">
        <span className="mr-1 text-primary-light ">
          {votes.filter((vote) => vote.upvote)?.length}
        </span>
        <FontAwesomeIcon
          icon={likeClicked ? LikeIconFull : LikeIconEmpty}
          className={`h-5 w-5 text-primary-light ${
            currentUser ? 'cursor-pointer' : ''
          } `}
          onClick={() => clickVote('like')}
        />
      </span>
      <span className="flex h-6">
        <span className="mr-1 text-error">
          {votes.filter((vote) => !vote.upvote)?.length}
        </span>

        <FontAwesomeIcon
          icon={unlikeClicked ? DislikeIconFull : DislikeIconEmpty}
          className={`mt-1 h-5 w-5 text-error ${
            currentUser ? 'cursor-pointer' : ''
          } `}
          onClick={() => clickVote('unlike')}
        />
      </span>
      {(loadingUpsertVote || loadingRemoveVote) && <Spinner size="sm" />}
    </div>
  )
}

export default LikeUnlikeButtons
