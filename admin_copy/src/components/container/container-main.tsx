import { FC, memo } from 'react'
import { Layout } from 'antd'
import { ContainerMainInner } from './style'
import ErrorBoundary from '../error-boundary'

const ContainerMain: FC = memo(props => {
  return (
    <Layout.Content>
      <ErrorBoundary>
        <ContainerMainInner> {props.children}</ContainerMainInner>
      </ErrorBoundary>
    </Layout.Content>
  )
})

export default ContainerMain
