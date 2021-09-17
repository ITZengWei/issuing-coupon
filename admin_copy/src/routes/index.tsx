import { Redirect } from 'react-router-dom'
import { Suspense, lazy, FC } from 'react'
import CommonLoading from '../components/loading/common-loading'
import { IRoute } from './types'

/**
 * 布局相关路由
 */
/** 引入初始化布局(用于获取用户信息，初始化网站) */
import InitLayout from '../layouts/init-layout'

/** 引入系统用户相关布局(登录，注册，找回密码之类的) */
import UserLayout from '../layouts/user-layout'

/** 错误相关布局 (403, 404 之类的) */
import ErrorLayout from '../layouts/error-layout'
import { IUserType } from '../store/module/user/reducer'
import ActiveMange from '../views/active-mange/activeMange'
import UsedCoupon from '../views/used-coupon/index'

/** 登录页面 */
// import Login from '../views/system/login'

/** 引入基础布局组件(侧边栏，顶部通栏之类的) */
const BaseLayout = lazy(() => import('../layouts/base-layout'))

/**
 * 系统相关路由
 */

// /** 登录页面 */
const Login = lazy(() => import('../views/system/login'))

/** 注册页面 */
const Register = lazy(() => import('../views/system/register'))

/**
 * 业务相关路由
 */

/** 引入分析页面 */
const Analyses = lazy(() => import('../views/analyses'))

/** 菜单树页面 */
const MenuTree = lazy(() => import('../views/menu-tree'))

/** 用户中心页面  */
const AccountCenter = lazy(() => import('../views/account-center'))

/** 用户设置页面 */
const AccountSetting = lazy(() => import('../views/account-setting'))

/** 用户列表页面 */
const AccountList = lazy(() => import('../views/account-list'))

/** 平台优惠券 */
const PlatformCoupon = lazy(() => import('../views/platform-coupon'))

/** 审核优惠券 */
const CheckCoupon = lazy(() => import('../views/check-coupon'))

/** 发放优惠券 */
const PublishCoupon = lazy(() => import('../views/publish-coupon'))

/** 商家优惠券 */
const StoreCoupon = lazy(() => import('../views/store-coupon'))

/** 店铺信息 */
const StoreInfo = lazy(() => import('../views/store-info'))

/**
 * 错误相关路由
 */

/** 404 页面 */
const NotFound = lazy(() => import('../views/error/not-found'))

/** 403 页面 */
const Forbidden = lazy(() => import('../views/error/forbidden'))

export const GeneratorSuspenseComponent = (Page: FC, Loading?: FC) => {
  return (props: any) => {
    if (typeof Loading === 'undefined') {
      Loading = CommonLoading
    }

    return (
      <Suspense fallback={<Loading />}>
        <Page {...props} />
      </Suspense>
    )
  }
}

const routes: IRoute[] = [
  {
    path: '/',
    meta: { title: '初始化' },
    component: InitLayout,
    routes: [
      {
        path: '/system',
        component: UserLayout,
        meta: {
          title: '系统路由',
        },
        routes: [
          {
            path: '/system',
            exact: true,
            meta: { title: 'default to Login' },
            render: () => <Redirect to="/system/login" />,
          },
          {
            path: '/system/login',
            component: Login,
            meta: {
              title: '登录',
            },
          },
          {
            path: '/system/register',
            component: Register,
            meta: {
              title: '注册',
            },
          },
        ],
      },
      {
        path: '/error',
        meta: {
          title: '错误页面',
        },
        component: ErrorLayout,
        routes: [
          {
            path: '/error/404',
            component: NotFound,
            meta: {
              title: 'not found 404',
              icon: '',
            },
          },
          {
            path: '/error/403',
            component: Forbidden,
            meta: {
              title: 'forbidden',
              icon: '',
            },
          },
        ],
      },
      {
        path: '/',
        component: BaseLayout,
        meta: {
          title: '业务路由',
        },
        routes: [
          {
            path: '/',
            exact: true,
            meta: { title: 'default to analyses' },
            render: () => <Redirect to="/dashboard/analyses" />,
          },
          {
            path: '/dashboard/analyses',
            component: GeneratorSuspenseComponent(Analyses),
            meta: {
              title: '分析页',
            },
          },
          {
            path: '/coupon/platform',
            component: GeneratorSuspenseComponent(PlatformCoupon),
            meta: { title: '平台优惠券' },
            auth: [IUserType.couponAdmin],
          },
          {
            path: '/coupon/check',
            component: GeneratorSuspenseComponent(CheckCoupon),
            meta: { title: '审核优惠券' },
            auth: [IUserType.couponAdmin],
          },
          {
            path: '/coupon/publish',
            component: GeneratorSuspenseComponent(PublishCoupon),
            meta: { title: '发放优惠券' },
            auth: [IUserType.couponAdmin, IUserType.company],
          },
          {
            path: '/coupon/store',
            component: GeneratorSuspenseComponent(StoreCoupon),
            meta: { title: '商家优惠券' },
            auth: [IUserType.company],
          },
          {
            path: '/menu/tree',
            component: GeneratorSuspenseComponent(MenuTree),
            meta: { title: '菜单树' },
            auth: [IUserType.systemAdmin],
          },
          {
            path: '/account/list',
            component: GeneratorSuspenseComponent(AccountList),
            meta: { title: '用户列表' },
            auth: [IUserType.systemAdmin],
          },
          {
            path: '/account/store',
            component: GeneratorSuspenseComponent(StoreInfo),
            meta: { title: '店铺信息' },
            auth: [IUserType.company, IUserType.readyCompany],
          },
          {
            path: '/account/center',
            component: GeneratorSuspenseComponent(AccountCenter),
            meta: { title: '个人中心' },
          },
          {
            path: '/account/setting',
            component: GeneratorSuspenseComponent(AccountSetting),
            meta: { title: '个人设置' },
          },
          {
            path: '/activeManage',
            component: GeneratorSuspenseComponent(ActiveMange),
            meta: {
              title: '活动管理',
            },
          },
          {
            path: '/coupon/used',
            component: GeneratorSuspenseComponent(UsedCoupon),
            meta: {
              title: '已使用优惠券',
            },
          },
          {
            path: '*',
            meta: { title: 'match other page' },
            render: () => <Redirect to="/error/404" />,
          },
        ],
      },
    ],
  },
]

export default routes
