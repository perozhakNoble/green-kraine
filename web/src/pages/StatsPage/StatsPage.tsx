import { useState } from 'react'

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Form, LoadingState } from '@ui'
import { FieldType } from '@ui/enums'
import { H4 } from '@ui/Typography'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import {
  GetCategoriesAsOptions,
  GetKeywordsAsOptions,
  StatsQuery,
} from 'types/graphql'

import { useForm } from '@redwoodjs/forms'
import { MetaTags, useQuery } from '@redwoodjs/web'

import { GET_CATEGORIES_AS_OPTIONS } from 'src/components/Categories/Categories.graphql'
import { GraphBuilder } from 'src/components/Graphs/GraphBuilder.class'
import { GET_KEYWORDS_AS_OPTIONS } from 'src/components/Keywords/Keywords.graphql'
import { ProblemStatus } from 'src/constants/problem'
import { TranslationKeys } from 'src/i18n'

const STATS_QUERY = gql`
  query StatsQuery($filters: StatsFilters) {
    getStats(filters: $filters) {
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

type FiltersForm = {
  dateFrom?: string
  dateTo?: string
  categories?: string[]
  keywords?: string[]
}

const Filters = ({ apply }) => {
  const formMethods = useForm<FiltersForm>({
    defaultValues: getDefaultValues(),
  })

  const { t } = useTranslation()

  const { data: categoriesData, loading: categoriesLoading } =
    useQuery<GetCategoriesAsOptions>(GET_CATEGORIES_AS_OPTIONS)

  const { data: keywordsData, loading: keywordsLoading } =
    useQuery<GetKeywordsAsOptions>(GET_KEYWORDS_AS_OPTIONS)

  return (
    <Form.Wrapper formMethods={formMethods} onSubmit={apply} withoutButtons>
      <div className="flex gap-2">
        <Form.Field<FiltersForm>
          name="dateFrom"
          label={t(TranslationKeys.date_from)}
          type={FieldType.date}
          maxDate={new Date()}
          onChange={(dt) => {
            if (dt && formMethods.watch('dateTo')) {
              const fromDate = DateTime.fromFormat(dt, DATE_FORMAT)

              const toDate = DateTime.fromFormat(
                formMethods.watch('dateTo'),
                DATE_FORMAT
              )
              if (fromDate.diff(toDate).milliseconds > 0) {
                formMethods.setValue('dateTo', dt)
              }
            }
          }}
        />
        <Form.Field<FiltersForm>
          name="dateTo"
          label={t(TranslationKeys.date_to)}
          type={FieldType.date}
          minDate={formMethods.watch('dateFrom')}
          maxDate={new Date()}
        />
        <Form.Field<FiltersForm>
          name="categories"
          label={t(TranslationKeys.categories)}
          type={FieldType.select}
          isMulti
          options={categoriesData?.options || []}
          loading={categoriesLoading}
        />
        <Form.Field<FiltersForm>
          name="keywords"
          label={t(TranslationKeys.key_words)}
          type={FieldType.select}
          isMulti
          options={keywordsData?.options || []}
          loading={keywordsLoading}
        />
        <div className="mt-7">
          <Button
            text=""
            icon={<FontAwesomeIcon icon={faSearch} />}
            onClick={formMethods.handleSubmit}
          />
        </div>
      </div>
    </Form.Wrapper>
  )
}

const DATE_FORMAT = `yyyy-M-d`

const getDefaultValues = (): FiltersForm => {
  return {
    dateFrom: DateTime.now()
      .minus({
        days: 7,
      })
      .toFormat(DATE_FORMAT),
    dateTo: DateTime.now().toFormat(DATE_FORMAT),
    categories: [],
    keywords: [],
  }
}

const StatsPage = () => {
  const { t } = useTranslation()

  const [filters, setFilters] = useState<FiltersForm>({
    dateFrom: DateTime.fromFormat(
      getDefaultValues().dateFrom,
      DATE_FORMAT
    ).toISO(),
    dateTo: DateTime.fromFormat(getDefaultValues().dateTo, DATE_FORMAT).toISO(),
    categories: [],
    keywords: [],
  })

  const { data: graphsData, loading } = useQuery<StatsQuery>(STATS_QUERY, {
    variables: {
      filters,
    },
  })

  const applyFilters = async (values: FiltersForm) => {
    setFilters({
      dateFrom: values.dateFrom
        ? DateTime.fromFormat(values.dateFrom, DATE_FORMAT).toISO()
        : null,
      dateTo: values.dateTo
        ? DateTime.fromFormat(values.dateTo, DATE_FORMAT).toISO()
        : null,
      categories: values.categories,
      keywords: values.keywords,
    })
  }

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
    .setMargin({ top: 5, right: 20, bottom: 60, left: 0 })
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
    .setMargin({ top: 5, right: 20, bottom: 60, left: 0 })
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
    .setMargin({ top: 5, right: 20, bottom: 60, left: 0 })
    .render()

  return (
    <>
      <MetaTags
        title={t(TranslationKeys.statistics)}
        description="Stats page"
      />

      <div className="mt-2 flex items-center">
        <H4 className="mx-6 my-4">{t(TranslationKeys.statistics)}</H4>
        <Filters apply={applyFilters} />
      </div>

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
