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

/** 登录页面 */
const RegisterResult = lazy(() => import('../views/system/register-result'))

/**
 * 业务相关路由
 */

/** 引入分析页面 */
const Analyses = lazy(() => import('../views/analyses'))

/** 工作台 */
const Workplace = lazy(() => import('../views/workplace'))

/** 菜单列表页面 */
const MenuList = lazy(() => import('../views/menu-list'))

/** 菜单树页面 */
const MenuTree = lazy(() => import('../views/menu-tree'))

/** 文章列表页面 */
const ArticleList = lazy(() => import('../views/article-list'))

/** 添加/编辑文章页面 */
const AddArticle = lazy(() => import('../views/add-article'))

/** 用户中心页面  */
const AccountCenter = lazy(() => import('../views/account-center'))
// import('../views/account-center')

/** 用户设置页面 */
const AccountSetting = lazy(() => import('../views/account-setting'))

/** 用户列表页面 */
const AccountList = lazy(() => import('../views/account-list'))

/** 分类管理 */
const CategoryAdmin = lazy(() => import('../views/category-admin'))

/** 相册管理 */
const AlbumAdmin = lazy(() => import('../views/album-admin'))

/** 记录管理 */
const RecordAdmin = lazy(() => import('../views/record-admin'))

/** 游戏管理 */
const GameAdmin = lazy(() => import('../views/game-admin'))

/** 书签栏目 */
const BookmarkColumn = lazy(() => import('../views/bookmark-column'))

/** 收集的书签 */
const BookmarkCollect = lazy(() => import('../views/bookmark-collect'))

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
          {
            path: '/system/register-result',
            component: RegisterResult,
            meta: {
              title: '注册结果',
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
            path: '/dashboard/workplace',
            component: GeneratorSuspenseComponent(Workplace),
            meta: {
              title: '工作台',
            },
          },
          {
            path: '/categoryAdmin',
            component: GeneratorSuspenseComponent(CategoryAdmin),
            meta: { title: '分类管理' },
            auth: [IUserType.superAdmin],
          },
          {
            path: '/albumAdmin',
            component: GeneratorSuspenseComponent(AlbumAdmin),
            meta: { title: '相册管理' },
            auth: [IUserType.superAdmin],
          },
          {
            path: '/recordAdmin',
            component: GeneratorSuspenseComponent(RecordAdmin),
            meta: { title: '记录管理' },
            auth: [IUserType.superAdmin, IUserType.admin],
          },
          {
            path: '/gameAdmin',
            component: GeneratorSuspenseComponent(GameAdmin),
            meta: { title: '游戏管理' },
            auth: [IUserType.superAdmin],
          },
          {
            path: '/menu/list',
            component: GeneratorSuspenseComponent(MenuList),
            meta: { title: '菜单列表' },
            auth: [IUserType.superAdmin],
          },
          {
            path: '/menu/tree',
            component: GeneratorSuspenseComponent(MenuTree),
            meta: { title: '菜单树' },
            auth: [IUserType.superAdmin],
          },
          {
            path: '/article/list',
            component: GeneratorSuspenseComponent(ArticleList),
            meta: { title: '文章列表' },
            auth: [IUserType.superAdmin, IUserType.admin],
          },
          {
            path: '/article/add',
            component: GeneratorSuspenseComponent(AddArticle),
            meta: { title: '写文章' },
            auth: [IUserType.superAdmin, IUserType.admin],
            exact: true,
          },
          {
            path: '/article/add/:id',
            component: GeneratorSuspenseComponent(AddArticle),
            meta: { title: '编辑文章' },
            auth: [IUserType.superAdmin, IUserType.admin],
          },
          {
            path: '/bookmark/column',
            component: GeneratorSuspenseComponent(BookmarkColumn),
            meta: { title: '书签栏目' },
            auth: [IUserType.admin, IUserType.superAdmin],
          },
          {
            path: '/bookmark/collect',
            component: GeneratorSuspenseComponent(BookmarkCollect),
            meta: { title: '书签收集' },
            auth: [IUserType.admin, IUserType.superAdmin],
          },
          {
            path: '/account/list',
            component: GeneratorSuspenseComponent(AccountList),
            meta: { title: '用户列表' },
            auth: [IUserType.superAdmin],
          },
          {
            path: '/account/center',
            component: GeneratorSuspenseComponent(AccountCenter),
            meta: { title: '个人中心' },
          },
          // {
          //   path: '/account/center',
          //   component: AccountCenter,
          //   meta: { title: '个人中心' },
          // },
          {
            path: '/account/setting',
            component: GeneratorSuspenseComponent(AccountSetting),
            meta: { title: '个人设置' },
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
