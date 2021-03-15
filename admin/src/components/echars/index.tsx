// import { FC, memo, useEffect, useRef } from 'react'
// import { EChartOption } from 'echarts'

export default {}

// // import ReactEcharts from 'echarts-for-react'

// import * as echarts from 'echarts'
// import { debounce } from '../../utils/tool'

// interface SimpleEchartProps {
//   option: EChartOption
// }

// const SimpleEchart: FC<SimpleEchartProps> = memo(props => {
//   const { option } = props

//   return (
//     <ReactEcharts
//       option={option}
//       notMerge={true}
//       lazyUpdate={true}
//       style={{ height: '100%' }}
//     />
//   )
// })

// const SimpleEchart: FC<SimpleEchartProps> = memo(props => {
//   const { option } = props

//   const wra = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const myChart = echarts.init(wra.current!)
//     myChart.setOption(option)

//     const debounceResize = debounce(() => myChart.resize(), 300) as any

//     window.addEventListener('resize', debounceResize)

//     return () => window.removeEventListener('resize', debounceResize)
//   }, [option])

//   return <div ref={wra} style={{ width: '100%', height: '100%' }} />
// })

// export default SimpleEchart
