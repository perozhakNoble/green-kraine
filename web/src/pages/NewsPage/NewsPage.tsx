import { LoadingState } from '@ui'
import { H4, H6 } from '@ui/Typography'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { ProblemsForNewsQuery } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useQuery } from '@redwoodjs/web'

import { ProblemStatus } from 'src/constants/problem'
import { getLanguageLocaleFromLocalStorage } from 'src/hooks/useLanguageLocaleStorage'
import { TranslationKeys } from 'src/i18n'

export const PROBLEMS_NEWS_QUERY = gql`
  query ProblemsForNewsQuery {
    problemsForNews {
      id
      title
      severity
      status
      user {
        id
        name
        email
      }
      description
      keywords {
        id
        title
      }
      createdAt
      updatedAt
      comments {
        id
      }
      category {
        id
        name
      }
      votes {
        id
      }
    }
  }
`

const NewsPage = () => {
  const { t } = useTranslation()

  const { data: problemsData, loading } = useQuery<ProblemsForNewsQuery>(
    PROBLEMS_NEWS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-and-network',
    }
  )

  const items = problemsData?.problemsForNews || []

  const statusColor = (status: ProblemStatus) => {
    switch (status) {
      case ProblemStatus.RESOLVED:
        return '!text-[#059669]'
      case ProblemStatus.IN_PROGRESS:
        return '!text-[#f97316]'
      case ProblemStatus.OPEN:
        return '!text-[#38bdf8]'
      case ProblemStatus.REJECTED:
        return '!text-[#e11d48]'
      default:
        return ''
    }
  }

  return (
    <>
      <MetaTags title={t(TranslationKeys.news)} description="News page" />

      <H4 className="mx-6 my-4">{t(TranslationKeys.news)}</H4>

      <LoadingState loading={loading} />

      <div className="flex w-full flex-col items-center gap-y-3 p-2 ">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative w-full max-w-3xl cursor-pointer rounded-xl  border border-gray-100 px-4 pt-4 pb-2.5 shadow-lg transition-transform hover:scale-105"
            onClick={() => {
              navigate(
                routes.home({
                  id: item.id,
                })
              )
            }}
          >
            <div
              className={`absolute right-3 top-2.5 text-xs ${statusColor(
                item.status as ProblemStatus
              )}`}
            >
              {t(item.status)}
            </div>
            <div className="absolute right-3 bottom-2.5 text-xs text-gray-300">
              {t(TranslationKeys.last_update_at)}:{' '}
              {DateTime.fromISO(item.updatedAt)
                .setLocale(getLanguageLocaleFromLocalStorage())
                .toFormat('HH:mm, dd LLL, yyyy')}
            </div>
            <H6>{item.title}</H6>
            <div className="mt-2 text-sm text-gray-600">{item.description}</div>

            <div className="mt-2 text-xs text-gray-600">
              {t(TranslationKeys.category) + ': ' + item.category.name}
            </div>

            <div className="mt-0.5 text-xs text-gray-600">
              {t(TranslationKeys.key_words) +
                ': ' +
                item.keywords.map((keyword) => keyword.title).join(', ')}
            </div>

            <div className="mt-3 text-xs text-gray-400">
              {t(TranslationKeys.author)}: {item.user.name}
            </div>
            <div className="text-xs text-gray-400">
              {t(TranslationKeys.severity)}: {item.severity}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default NewsPage
