import { IUserType } from './../store/module/user/reducer'
import { IRoute } from './types'
import routes from './index'

/** 拿到系统、错误、业务 */
let { routes: rootRoutes } = routes[0]

/** 扁平化路由 */
const flattenRoute = (routes: IRoute[]) => {
  let result: IRoute[] = []
  routes.forEach(r => {
    result.push(r)
    if (r.routes) {
      result = result.concat(flattenRoute(r.routes))
    }
  })

  return result
}

/** 继承权限 */
export const extendAuth = (routes: IRoute[], parentAuth: IUserType[]) => {
  routes.forEach(route => {
    const { auth: childAuth, routes: childRoutes } = route
    /** 合并继承 auth */
    route.auth = childAuth ? [...parentAuth, ...childAuth] : [...parentAuth]

    /** 如果有权限，并且有子路由 */
    if (childRoutes) {
      extendAuth(childRoutes, route.auth)
    }
  })
}

/** 获取业务路由 */
const getBusinessRoutes = () => {
  const businessRoutes = rootRoutes!.find(route => {
    const { meta, routes } = route
    if (meta.title === '业务路由') {
      return routes
    }
  })!

  /** 继承权限 */
  // extendAuth(businessRoutes.routes!, [])

  return businessRoutes
}

/** 导出业务路由 */
export const businessRoutes = getBusinessRoutes()

/** 查找路由 */
export const findBusiness = (pathname: string) => {
  return flattenRoute(businessRoutes.routes!).find(r => r.path === pathname)
}
