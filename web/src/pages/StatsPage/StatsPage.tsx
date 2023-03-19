import { LoadingState } from '@ui'
import { H4 } from '@ui/Typography'
import { useTranslation } from 'react-i18next'

import { MetaTags } from '@redwoodjs/web'

import { GraphBuilder } from 'src/components/Graphs/GraphBuilder.class'
import { TranslationKeys } from 'src/i18n'

const StatsPage = () => {
  const { t } = useTranslation()

  const LineGraphic = new GraphBuilder('LineChart')
    .setData([
      { date: '2015', USD: 12, UAH: 13 },
      { date: '2016', USD: 2, UAH: 24 },
      { date: '2017', USD: 6, UAH: 7 },
    ])
    .setCastedianGrid({ stroke: '#ccc', strokeDasharray: '5 5' })
    .setMargin({ top: 5, right: 20, bottom: 25, left: 0 })
    .setXAxis({ dataKey: 'date' })
    .setYAxis()
    .setTooltip()
    .setLines([
      {
        dataKey: 'USD',
        stroke: '#447ef7',
      },
      {
        dataKey: 'UAH',
        stroke: '#fb404b',
      },
    ])
    .render()

  const BarGraphic = new GraphBuilder('BarChart')
    .setData([
      { date: '2015', USD: 12, UAH: 13 },
      { date: '2016', USD: 2, UAH: 24 },
      { date: '2017', USD: 6, UAH: 7 },
    ])
    .setCastedianGrid({ stroke: '#ccc', strokeDasharray: '3 3' })
    .setXAxis({ dataKey: 'date' })
    .setYAxis()
    .setTooltip()
    .setBars([
      {
        dataKey: 'USD',
        fill: '#F7CAC9', // isIncomings ? '#F7CAC9' : '#8884d8',
      },
      {
        dataKey: 'UAH',
        fill: '#92A8D1', // isIncomings ? '#92A8D1' : 'rgba(135,203,22,0.6)',
      },
    ])
    .setMargin({ top: 5, right: 20, bottom: 25, left: 0 })
    .render()

  const PieGraphic = new GraphBuilder('PieChart')
    .setData([
      { value: 12, name: 'Like', color: '#047857' },
      { value: 13, name: 'Dislike', color: '#dc2626' },
    ])
    .setPie({ dataKey: 'value' })
    .render()

  return (
    <>
      <MetaTags
        title={t(TranslationKeys.statistics)}
        description="Stats page"
      />

      <H4 className="mx-6 my-4">{t(TranslationKeys.statistics)}</H4>

      <LoadingState loading={false} />
      <div className="flex flex-col">
        <LineGraphic />

        <BarGraphic />

        <div className="mx-3 lg:w-1/2">
          <PieGraphic />
        </div>
        <div className="h-4" />
      </div>
    </>
  )
}

export default StatsPage
