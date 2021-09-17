import { FC, memo, useMemo, useState } from 'react'
import { Spin, Form, Input, Button, message, Grid } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, Redirect } from 'react-router-dom'
import Texty from 'rc-texty'
import 'rc-texty/assets/index.css'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { LoginWithRegisterContainer, BrandWra, FormAreaWra } from './style'
import { loginRequest } from '../../../api/user'
import { IStoreState } from '../../../store/types'
import { IUserInfo } from '../../../store/module/user/reducer'
import {
  handleSetRole,
  handleSetToken,
  handleChangeUserInfo,
  handleSetIsLogin,
} from '../../../store/module/user/actionCreators'
import { getUserType } from '../../../utils/person'
import { throttle } from '../../../utils/tool'

const { useBreakpoint } = Grid

/** 大图广告区域 */
export const Brand = memo(() => {
  const { lg } = useBreakpoint()

  /** 是否展示移动端侧边栏 */
  const isMobile = lg === false

  if (isMobile) {
    return null
  }

  return (
    <BrandWra>
      <Texty className="brandInfo__title" type="top">
        优惠券发放后台管理中心
        {/* <h3 className="brandInfo__title">个人博客后台管理中心</h3> */}
      </Texty>
      <Texty
        className="brandInfo__subtitle"
        type="bottom"
        mode="sync"
        duration={600}
      >
        优惠券是重要而实用的营销工具。用于拉新、引流、促活、转化、二次消费、打造私域流量的必备工具。设置关注、转载、好评、晒单等动作后才能获取优惠券，在流量越来越贵的今天，是一个不错的营销思路。
      </Texty>
    </BrandWra>
  )
})

/** 登录请求结果 */
interface LoginRequestResult {
  /** Token令牌 */
  token: string

  /** 用户信息 */
  userInfo: IUserInfo
}

/** 登录表单结果 */
interface LoginFormResult {
  account: string
  password: string
}

interface LoginProps {
  /** 是否登录 */
  isLogin: boolean

  /** 登录成功 */
  loginSuccess: (successResult: LoginRequestResult) => void
}

const Login: FC<LoginProps> = props => {
  const { isLogin, loginSuccess } = props
  const [isLoading, setLoading] = useState(false)

  const onFinish = useMemo(() => {
    return throttle((result: LoginFormResult) => {
      setLoading(true)
      loginRequest<LoginRequestResult>(result)
        .then(res => {
          setLoading(false)
          if (res.data.data.userInfo.type === 1) {
            return message.warning('普通用户暂无权限！！！')
          }
          loginSuccess(res.data.data)
        })
        .catch(error => {
          setLoading(false)
          message.error(error.message)
        })
    }, 1200)
  }, [loginSuccess]) as (values: any) => void

  if (isLogin) {
    return <Redirect to="/" />
  }

  return (
    <LoginWithRegisterContainer>
      <Brand />
      <FormAreaWra>
        <Spin spinning={isLoading}>
          <h4 className="formArea__title">管理员登录</h4>
          <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
              className="formArea__item"
              name="account"
              rules={[{ required: true, message: '账号不能为空!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="账号或手机号"
              />
            </Form.Item>
            <Form.Item
              className="formArea__item"
              name="password"
              rules={[{ required: true, message: '密码不能为空!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </FormAreaWra>
    </LoginWithRegisterContainer>
  )
}

const mapState = (store: IStoreState) => {
  const { isLogin } = store.user

  return {
    isLogin,
  }
}

const mapDispatch = (dispatch: Dispatch) => {
  return {
    /** 登录成功 */
    loginSuccess(successResult: LoginRequestResult) {
      /** 本地存储 用户Id */
      dispatch(handleSetRole(getUserType(successResult.userInfo)))
      dispatch(handleChangeUserInfo(successResult.userInfo))
      dispatch(handleSetToken(successResult.token))
      dispatch(handleSetIsLogin(true))
    },
  }
}

export default connect(mapState, mapDispatch)(Login)
