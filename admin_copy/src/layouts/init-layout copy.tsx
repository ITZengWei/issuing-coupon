import { FC, useEffect, Suspense, memo } from 'react'
import { withRouter } from 'react-router-dom'
import { RouteConfigComponentProps } from 'react-router-config'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { renderRoutes } from 'react-router-config'
import { IStoreState } from '../store/types'
import { IUserInfo } from '../store/module/user/reducer'
import { UserUrls } from '../api/user'
import LayoutLoading from '../components/loading/layout-loading'
import {
  handleFetchUserInfoFailed,
  handleFetchUserInfoSuccess,
  handleToggleEnterLoading,
  SuccessResult,
} from '../store/module/user/actionCreators'
import { getUserType } from '../utils/person'
import { normalRequest } from '../utils/request'
import config from '../config'
import { combineURL } from '../utils/tool'
import { getToken } from '../utils/cookie'

interface InitLayoutProps extends RouteConfigComponentProps {
  /** 进入加载状态 */
  enterLoading: boolean

  /** 用户信息 */
  userInfo: IUserInfo | null

  /** 登录令牌 */
  token: string

  /** 是否登录 */
  isLogin: boolean

  /** 切换进场动画 */
  toggleEnterLoading: (isLoading: boolean) => void

  /** 获取用户信息成功 */
  fetchUserSuccess: (result: SuccessResult) => void

  /** 获取用户信息失败 */
  fetchUserFailed: () => void
}

/**
 * 初始化布局
 * 1. 根据 token 获取用户信息
 * 2. 有用户信息，初始化一些属性，没有的话去登录页
 */
const InitLayout: FC<InitLayoutProps> = memo(props => {
  const {
    enterLoading,
    toggleEnterLoading,
    fetchUserSuccess,
    fetchUserFailed,
  } = props

  useEffect(() => {
    /** 设置 enterLoading 为 true */
    toggleEnterLoading(true)

    /** 获取用户信息 */
    normalRequest<IUserInfo>({
      url: combineURL(config.API_URL, UserUrls.fetchUserInfo),
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
    })
      .then(res => {
        const { data } = res.data
        /** 获取用户信息成功：拿到用户信息，设置用户的角色 */
        const result: SuccessResult = {
          userInfo: data,
          role: getUserType(data),
        }
        fetchUserSuccess(result)
      })
      .catch(e => {
        /** 获取用户信息失败：设置用户信息为空，登录状态为假，清空token，重定向到登录页 */
        fetchUserFailed()
        props.history.replace('/system/login')
      })
      .finally(() => {
        /** 设置 enterLoading 为 false */
        toggleEnterLoading(false)
      })
  }, [toggleEnterLoading, fetchUserSuccess, fetchUserFailed])

  if (enterLoading) {
    return <LayoutLoading />
  }

  return (
    <Suspense fallback={<LayoutLoading />}>
      <div className="">{renderRoutes(props.route?.routes)}</div>
    </Suspense>
  )
})

const mapState = (store: IStoreState) => {
  // console.log(store)
  const { enterLoading, userInfo, token } = store.user

  return {
    enterLoading,
    userInfo,
    token,
  }
}

const mapDispatch = (dispatch: Dispatch) => {
  return {
    /** 切换进场动画 */
    toggleEnterLoading(isLoading: boolean) {
      dispatch(handleToggleEnterLoading(isLoading))
    },
    /** 获取用户信息成功 */
    fetchUserSuccess(result: SuccessResult) {
      dispatch<any>(handleFetchUserInfoSuccess(result))
    },
    /** 获取用户信息失败 */
    fetchUserFailed() {
      dispatch<any>(handleFetchUserInfoFailed())
    },
  }
}

export default connect(mapState, mapDispatch)(withRouter(InitLayout))
