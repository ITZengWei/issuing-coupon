import { FC, memo, ReactNode, CSSProperties, useState, useEffect } from 'react'
import { Layout, Grid, Drawer } from 'antd'
import ContainerAside, { IAsideMenu } from './container-aside'
import ContainerHeader from './container-header'
import ContainerMain from './container-main'
import ContainerFooter from './container-footer'
import { ContainerWrapper } from './style'
import { IUserInfo, IUserType } from '../../store/module/user/reducer'
import { handleLogout } from '../../store/module/user/actionCreators'
import useShallowEqualSelector from '../../hooks/use-shallow-equal-selector'
import useActions from '../../hooks/use-actions'
import globalStyle from '../../styles/global-style'
import {
  ContainerContext,
  ContainerContextProps,
  MenuContext,
  MenuContextProps,
} from './context'

const { useBreakpoint } = Grid

/** 从 redux 中获取的 store 属性 */
interface IStoreProps {
  /** 用户信息 */
  userInfo: IUserInfo | null

  /** 用户角色 */
  role: IUserType
}

interface ContainerProps {
  /** 子节点 */
  children: ReactNode
}

export const Container: FC<ContainerProps> = memo(props => {
  const { children } = props

  /** 是否展示侧边栏蒙层 */
  const [isVisible, setVisible] = useState(false)

  /** 获取 store 里面的信息 */
  const { userInfo } = useShallowEqualSelector<IStoreProps>(state => {
    const { userInfo, role } = state.user
    return { userInfo, role }
  })

  /** 退出登录 */
  const logout = useActions(handleLogout)

  const { md } = useBreakpoint()

  /** 是否展示移动端侧边栏 */
  const isShowMobileAside = md === false

  const contextValue: ContainerContextProps = {
    logout,
    userInfo,
  }

  /** 初始化侧边栏菜单 */
  const [menus, setMenus] = useState<IAsideMenu[]>([])

  /** 菜单作用域 */
  const menuContextValue: MenuContextProps = {
    menus,
    setMenus,
  }

  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    background: globalStyle['background-color'],
  }
  const rightContainerStyle: CSSProperties = {
    background: 'inherit',
    padding: isShowMobileAside ? '' : '15px 15px 0',
  }

  /** 切换侧边栏的展示和隐藏 */
  const toggleAsideVisible = () => setVisible(v => !v)

  /** 如果检测到展示移动端侧边栏，我们手动设置visible为false */
  useEffect(() => {
    setVisible(false)
  }, [isShowMobileAside])

  /** 根据 屏幕宽动态渲染 侧边栏 */
  const renderAside = () => {
    if (isShowMobileAside) {
      return (
        <Drawer
          placement="left"
          closable={false}
          className="ctr-aside-drawer"
          visible={isVisible}
          onClose={toggleAsideVisible}
          width={200}
        >
          <ContainerAside isMobile={true} />
        </Drawer>
      )
    }

    return <ContainerAside isMobile={false} />
  }

  return (
    <ContainerContext.Provider value={contextValue}>
      <MenuContext.Provider value={menuContextValue}>
        <ContainerWrapper>
          <Layout style={containerStyle} hasSider={true}>
            {/* 侧边栏区域 */}
            {renderAside()}

            <Layout style={rightContainerStyle}>
              {/* 头部区域 */}
              <ContainerHeader
                isMobile={isShowMobileAside}
                toggle={toggleAsideVisible}
              />

              {/* 主区域 */}
              <ContainerMain>{children}</ContainerMain>

              {/* 底部区域 */}
              <ContainerFooter />
            </Layout>
          </Layout>
        </ContainerWrapper>
      </MenuContext.Provider>
    </ContainerContext.Provider>
  )
})

export default Container
