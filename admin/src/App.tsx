import React from 'react'
import { ConfigProvider } from 'antd'
// import 'antd/dist/antd.css'
import zhCN from 'antd/lib/locale/zh_CN'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import config from './config'
import store from './store/index'
import routes from './routes/index'
import BasicStyle from './styles/basic-style'
import ErrorBoundary from './components/error-boundary'

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <Router basename={config.BASENAME}>
            <BasicStyle />
            {/* <IconStyle /> */}

            <div className="app">{renderRoutes(routes)}</div>
          </Router>
        </Provider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App
