import { FC, memo, useMemo } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RouteConfigComponentProps } from 'react-router-config'
import { renderRoutes } from 'react-router-config'
import { IStoreState } from '../store/types'
import Container from '../components/container'
import { IUserType } from '../store/module/user/reducer'
import { findBusiness } from '../routes/util'

const BaseLayout: FC<RouteConfigComponentProps> = memo(props => {
  const { route, location } = props

  const isLogin = useSelector<IStoreState, Boolean>(state => state.user.isLogin)

  const role = useSelector<IStoreState, IUserType>(state => state.user.role)

  const isForbidden = useMemo(() => {
    let { pathname } = location
    /** 重定向带来的坑 */
    if (pathname === '/') {
      pathname = '/dashboard/analyses'
    }
    const route = findBusiness(pathname)

    /** 没有找到路由信息 (todo) */
    if (route === undefined) {
      return false
    }
    const { auth } = route

    /** 不包含权限默认是可以访问 */
    if (auth === undefined || auth.length === 0) return false

    /** 如果存在 auth， 但是当前用户类型不包含里面，设置为 forbidden */
    return auth.includes(role) === false
  }, [role, location.pathname])

  /** 没有登录重定向到登录页 */
  if (!isLogin) {
    return <Redirect to="/system/login" />
  }

  /** 没有权限访问 */
  if (isForbidden) {
    return <Redirect to="/error/403" />
  }

  return <Container>{renderRoutes(route?.routes)}</Container>
})

export default BaseLayout
