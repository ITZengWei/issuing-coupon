import { FC, memo, useState, useEffect, useMemo } from 'react'
import { Card, Empty, Row, Col, Statistic, Button } from 'antd'
import {
  ReadOutlined,
  ProfileOutlined,
  FileDoneOutlined,
  TagOutlined,
} from '@ant-design/icons'
import { IStoreState } from '../../store/types'
import { IUserType } from '../../store/module/user/reducer'
import { useSelector } from 'react-redux'


const Analyses: FC = memo((props: any) => {
  const role = useSelector<IStoreState, IUserType>(state => state.user.role)

  return (
    <div>
      <Row gutter={[16, 16]}>
      </Row>
    </div>
  )
})
export default Analyses 
