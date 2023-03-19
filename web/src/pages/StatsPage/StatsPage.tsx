import { LoadingState } from '@ui'
import { H4 } from '@ui/Typography'
import { useTranslation } from 'react-i18next'
import { StatsQuery } from 'types/graphql'

import { MetaTags, useQuery } from '@redwoodjs/web'

import { GraphBuilder } from 'src/components/Graphs/GraphBuilder.class'
import { ProblemStatus } from 'src/constants/problem'
import { TranslationKeys } from 'src/i18n'

const STATS_QUERY = gql`
  query StatsQuery {
    getStats {
      votes {
        likes
        dislikes
      }
      statuses {
        IN_PROGRESS
        OPEN
        REJECTED
        RESOLVED
      }
      categories {
        name
        count
      }
      keywords {
        name
        count
      }
      categoriesByStatus {
        name
        IN_PROGRESS
        OPEN
        REJECTED
        RESOLVED
      }
    }
  }
`

const StatsPage = () => {
  const { t } = useTranslation()

  const { data: graphsData, loading } = useQuery<StatsQuery>(STATS_QUERY)

  const getColor = (name: string) => {
    if (name === 'likes') return '#047857'
    if (name === 'dislikes') return '#dc2626'
    if (name === 'keywords') return '#82ca9d'
    if (name === 'categories') return '#8884d8'
    if (name === 'IN_PROGRESS') return '#f97316'
    if (name === 'OPEN') return '#38bdf8'
    if (name === 'REJECTED') return '#e11d48'
    if (name === 'RESOLVED') return '#059669'

    return ''
  }

  const categiriesBarData = graphsData?.getStats?.categories || []
  const keywordsBarData = graphsData?.getStats?.keywords || []
  const categoriesByStatusLineData =
    graphsData?.getStats?.categoriesByStatus || []

  const votesPieData = Object.entries(graphsData?.getStats?.votes || {})
    .filter((v) => v[0] !== '__typename')
    .map((v) => ({ value: v[1], name: v[0] }))
    .map((v) => ({ ...v, name: t(v.name), color: getColor(v.name) }))

  const statusesPieData = Object.entries(graphsData?.getStats?.statuses || {})
    .filter((v) => v[0] !== '__typename')
    .map((v) => ({ value: v[1], name: v[0] }))
    .map((v) => ({ ...v, name: t(v.name), color: getColor(v.name) }))

  const LineGraphic = new GraphBuilder('LineChart')
    .setData(categoriesByStatusLineData)
    .setCastedianGrid({ stroke: '#ccc', strokeDasharray: '5 5' })
    .setLegend()
    .setMargin({ top: 5, right: 20, bottom: 25, left: 0 })
    .setXAxis({ dataKey: 'name' })
    .setYAxis()
    .setTooltip()
    .setLines(
      Object.keys(ProblemStatus).map((v) => ({
        dataKey: v,
        stroke: getColor(v),
        name: t(v),
      }))
    )
    .render()

  const VotesPieGraphic = new GraphBuilder('PieChart')
    .setData(votesPieData)
    .setPie({ dataKey: 'value' })
    .setMargin({ top: 20, right: 20, bottom: 20, left: 20 })
    .render()

  const StatusesPieGraphic = new GraphBuilder('PieChart')
    .setData(statusesPieData)
    .setPie({ dataKey: 'value' })
    .setMargin({ top: 20, right: 20, bottom: 20, left: 20 })
    .render()

  const CategoriesBarGraphic = new GraphBuilder('BarChart')
    .setData(categiriesBarData)
    .setCastedianGrid({ stroke: '#ccc', strokeDasharray: '3 3' })
    .setXAxis({ dataKey: 'name' })
    .setYAxis()
    .setTooltip({})
    .setLegend({
      formatter: () => t(TranslationKeys.categories),
    })
    .setBars([
      {
        dataKey: 'count',
        fill: getColor('categories'),
        name: t(TranslationKeys.count_of_usage),
      },
    ])
    .setMargin({ top: 5, right: 20, bottom: 25, left: 0 })
    .render()

  const KeyWordsBarGraphic = new GraphBuilder('BarChart')
    .setData(keywordsBarData)
    .setCastedianGrid({ stroke: '#ccc', strokeDasharray: '3 3' })
    .setXAxis({ dataKey: 'name' })
    .setYAxis()
    .setTooltip({})
    .setLegend({
      formatter: () => t(TranslationKeys.key_words),
    })
    .setBars([
      {
        dataKey: 'count',
        fill: getColor('keywords'),
        name: t(TranslationKeys.count_of_usage),
      },
    ])
    .setMargin({ top: 5, right: 20, bottom: 25, left: 0 })
    .render()

  return (
    <>
      <MetaTags
        title={t(TranslationKeys.statistics)}
        description="Stats page"
      />

      <H4 className="mx-6 my-4">{t(TranslationKeys.statistics)}</H4>

      <LoadingState loading={loading} />

      <div className="flex flex-col">
        <LineGraphic />

        <div className="flex flex-col lg:flex-row">
          <div className="mx-3 lg:w-1/2">
            <KeyWordsBarGraphic />
          </div>
          <div className="mx-3 lg:w-1/2">
            <CategoriesBarGraphic />
          </div>
        </div>

        <div className="flex flex-col items-center lg:flex-row">
          <div className="mx-3 w-full items-center lg:w-1/2">
            <VotesPieGraphic />
          </div>
          <div className="mx-3  w-full  items-center lg:w-1/2">
            <StatusesPieGraphic />
          </div>
        </div>
        <div className="h-4" />
      </div>
    </>
  )
}

export default StatsPage
