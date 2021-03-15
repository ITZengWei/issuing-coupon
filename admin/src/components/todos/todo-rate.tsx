import { memo, FC } from 'react'
import { Card } from 'antd'
import { Liquid } from '@ant-design/charts'
import { LiquidConfig } from '@ant-design/charts/lib/liquid'
import globalStyle from '../../styles/global-style'

interface CompleteRateProps {
  /** 当前进度 */
  percent: number
}

/** 待办完成率 */
const CompleteRate: FC<CompleteRateProps> = memo(props => {
  const { percent } = props
  const config: LiquidConfig = {
    percent: percent,
    height: 200,
    statistic: {
      title: {
        formatter: () => '完成度',
        style(_ref) {
          var percent = _ref.percent
          return { fill: percent > 0.65 ? 'white' : globalStyle['theme-color'] }
        },
      },

      content: {
        style(_ref) {
          const percent = _ref.percent
          return {
            // fontSize: '30px',
            lineHeight: 1,
            fill: percent > 0.65 ? 'white' : globalStyle['theme-color'],
          }
        },
      },
    },
    liquidStyle(_ref) {
      var percent = _ref.percent
      return {
        fill: globalStyle['theme-color'],
        stroke: globalStyle['theme-color'],
      }
    },
  }

  return (
    <Card style={{ height: 240 }}>
      <div style={{ padding: '0 20%' }}>
        <Liquid {...config} />
      </div>
    </Card>
  )
})

export default CompleteRate
