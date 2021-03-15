import { FC, memo, CSSProperties } from 'react'

import { Spin } from 'antd'

const CommonLoading: FC = memo(props => {
  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: '400px',
  }

  return <Spin tip="Loading..." style={style} />
})

export default CommonLoading
