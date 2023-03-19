import React, { PureComponent } from 'react'

import { useMediaQuery } from '@chakra-ui/react'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Sector,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

class CustomizedAxisTick extends PureComponent {
  render() {
    // @ts-ignore
    const { x, y, payload } = this.props
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          fontSize={10}
          textAnchor="end"
          fill="#666"
          transform="rotate(-30)"
        >
          {payload.value}
        </text>
      </g>
    )
  }
}

export class GraphBuilder {
  #activeIndex = 1
  #height = undefined
  #width = undefined
  #margin = {}
  #pie = {}
  #castedianGrid = undefined
  #yAxis = undefined
  #xAxis = undefined
  #tooltip = undefined
  #lines = []
  #bars = []
  #data = []
  #chart = 'LineChart'

  constructor(type: 'LineChart' | 'PieChart' | 'BarChart') {
    this.#chart = type
  }

  #setActiveIndex(idx) {
    console.log(idx)
    this.#activeIndex = idx
  }

  #onPieEnter = (_, index) => {
    this.#setActiveIndex(index)
  }

  setPie(data) {
    this.#pie = data || {}
    return this
  }

  setMargin(data) {
    this.#margin = data || {}
    return this
  }

  setWidth(data) {
    this.#width = data
    return this
  }

  setHeight(data) {
    this.#height = data
    return this
  }

  setCastedianGrid(data) {
    this.#castedianGrid = <CartesianGrid {...data} />
    return this
  }

  setData(data) {
    this.#data = data
    return this
  }

  setYAxis() {
    this.#yAxis = <YAxis />
    return this
  }

  setXAxis(data) {
    this.#xAxis = <XAxis {...data} tick={<CustomizedAxisTick />} />
    return this
  }

  setTooltip() {
    this.#tooltip = <Tooltip />
    return this
  }

  setLines(lines) {
    this.#lines = lines.map((lineData, idx) => (
      <Line type="monotone" {...lineData} key={idx} />
    ))
    return this
  }

  setBars(bars) {
    this.#bars = bars.map((barData, idx) => <Bar {...barData} key={idx} />)
    return this
  }

  #renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
      index,
    } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    const onlyRate = false

    return (
      <g className="z-50">
        <text
          x={cx}
          y={cy + (index ? 20 : -20)}
          dy={8}
          textAnchor="middle"
          fill={fill}
        >
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        {onlyRate ? (
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            textAnchor={textAnchor}
            fill="#333"
          >{`${(percent * 100).toFixed(2)}%`}</text>
        ) : (
          <>
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              textAnchor={textAnchor}
              fill="#333"
            >{`${value}`}</text>
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              dy={18}
              textAnchor={textAnchor}
              fill="#999"
            >
              {`(${(percent * 100).toFixed(2)}%)`}
            </text>
          </>
        )}
      </g>
    )
  }

  #_

  render() {
    return () => {
      const [isLessThan800] = useMediaQuery('(max-width: 800px)')
      const [isLessThan400] = useMediaQuery('(max-width: 400px)')

      const getAspert = () => {
        return this.#chart !== 'PieChart'
          ? isLessThan400
            ? 1.3
            : isLessThan800
            ? 1.7
            : 2.5
          : isLessThan400
          ? 0.9
          : isLessThan800
          ? 1
          : 1.5
      }

      return (
        <ResponsiveContainer width={'99%'} aspect={getAspert()}>
          {this.#chart === 'LineChart' ? (
            <LineChart data={this.#data} margin={this.#margin}>
              {this.#castedianGrid} {this.#xAxis} {this.#yAxis} {this.#tooltip}{' '}
              {this.#lines}
            </LineChart>
          ) : this.#chart === 'BarChart' ? (
            <BarChart data={this.#data} margin={this.#margin}>
              {this.#castedianGrid} {this.#xAxis} {this.#yAxis} {this.#tooltip}{' '}
              {this.#bars}
            </BarChart>
          ) : this.#chart === 'PieChart' ? (
            <PieChart>
              {/*@ts-ignore*/}
              <Pie
                {...this.#pie}
                data={this.#data}
                label={this.#renderActiveShape}
                innerRadius="50%"
                paddingAngle={2}
              >
                {this.#data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <></>
          )}
        </ResponsiveContainer>
      )
    }
  }
}
