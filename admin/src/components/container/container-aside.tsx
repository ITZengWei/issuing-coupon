import { FC, memo, ReactNode, useEffect, useState, useContext } from 'react'
import { Layout, Menu, Skeleton } from 'antd'
import { useSelector } from 'react-redux'
import { MenuProps } from 'antd/lib/menu'
import { SiderProps } from 'antd/lib/layout/Sider'
import { useHistory, useLocation } from 'react-router-dom'
import logoImg from '../../asserts/images/ContainerAside/banner.png'
import { ContainerAsideInner } from './style'
import { fetchAsideMenus } from '../../api/menu'
import { combineURL } from '../../utils/tool'
import {
  arr2menu,
  formatMenuPath,
  getAntdIconByIconStr,
} from '../../utils/menu'
import config from '../../config'
import useMenuSelectedKeys from '../../hooks/use-menu-selectd-keys'
import { MenuContext } from './context'
import { IUserType } from '../../store/module/user/reducer'
import { IStoreState } from '../../store/types'
import { ResponseMenuItemData } from '../../views/menu-list'

const { SubMenu } = Menu

/** 侧边栏菜单接口 */
export interface IAsideMenu {
  /** 菜单id */
  _id?: string

  /** 菜单标题 */
  title: string

  /** 菜单路径 */
  path: string

  /** 菜单图标 */
  icon?: any

  /** 菜单位置 */
  index: number

  /** 上级菜单 id(为一个数组)*/
  topIds?: string[]

  /** 侧边栏权限 */
  auth?: IUserType[]

  /** 子菜单 */
  children?: IAsideMenu[]
}

/** 菜单骨架屏 */
const MenuSkeleton: FC = memo(() => {
  return (
    <div>
      {new Array(5).fill(null).map((v, i) => {
        return (
          <div className="menu-placeholder" key={i}>
            <Skeleton.Avatar className="icon" active size={16} />
            <Skeleton.Input className="text" active />
          </div>
        )
      })}
    </div>
  )
})

/** 侧边栏按钮 */
const AsideMenu: FC = memo(() => {
  /** 获取菜单项状态 */
  const [isLoading, setLoading] = useState(false)

  /** 注意：这里拿不到实时的 location */
  const history = useHistory()

  const location = useLocation()

  const { menus, setMenus } = useContext(MenuContext)

  const menuSelectedKeys = useMenuSelectedKeys(location.pathname, menus)

  const userType = useSelector<IStoreState, IUserType>(
    state => state.user.userInfo!.type,
  )

  // const [openKeys, setOpenKes] = useState<string[]>(() => menuSelectedKeys)

  const menuProps: MenuProps = {
    theme: 'dark',
    mode: 'inline',
    selectedKeys: menuSelectedKeys,
    defaultOpenKeys: menuSelectedKeys,
    // openKeys: openKeys,
    onClick(info) {
      const { key } = info
      const pathname = combineURL(config.BASENAME, key as string)

      history.push(pathname)
    },
    // onOpenChange(changedOpenKey) {
    //   setOpenKes(changedOpenKey as string[])
    // },
  }

  useEffect(() => {
    setLoading(true)

    fetchAsideMenus<ResponseMenuItemData[]>(userType).then(res => {
      const { data } = res.data
      const menus = arr2menu(data)
      /** 将结果格式化路径 */
      const formatResMenus = formatMenuPath(menus)

      /** 将最新的 menus 同步到 context 中 */
      setMenus(formatResMenus)

      setLoading(false)
    })
  }, [userType])

  function renderChildrenMenu(navList: IAsideMenu[]): ReactNode {
    /** 转换为 Menu */
    return navList.map(nav => {
      const { title, path, icon, children } = nav

      /** 如果有多级路由 */
      if (children?.length) {
        return (
          <SubMenu title={title} icon={getAntdIconByIconStr(icon)} key={path}>
            {renderChildrenMenu(children)}
          </SubMenu>
        )
      }

      /** 单层路由 */
      return (
        <Menu.Item key={path} icon={getAntdIconByIconStr(icon)}>
          {title}
        </Menu.Item>
      )
    })
  }

  return (
    <Menu {...menuProps}>
      {isLoading ? <MenuSkeleton /> : renderChildrenMenu(menus)}
    </Menu>
  )
})

interface ContainerAsideProps {
  /** 当前是否为移动端(动态设置侧边栏) */
  isMobile: boolean
}

const ContainerAside: FC<ContainerAsideProps> = memo(props => {
  const [collapsed, setCollapsed] = useState(false)
  const { isMobile } = props

  /** 切换关闭与展开回调 */
  const handleCollapse = () => {
    setCollapsed(collapsed => !collapsed)
  }

  /** 根据是否移动端 动态返回 Sider 属性 */
  const getSliderProps: () => SiderProps = () => {
    const sliderProps: SiderProps = {}

    /** 获取收缩效果，如果是移动端 收缩效果由父组件控制，反之由 内部属性控制 */
    if (isMobile) {
      sliderProps.collapsed = false
      sliderProps.style = { height: '100%' }
    } else {
      sliderProps.collapsible = true
      sliderProps.collapsed = collapsed
      sliderProps.onCollapse = handleCollapse
      sliderProps.breakpoint = 'lg'
    }

    return sliderProps
  }

  return (
    <Layout.Sider {...getSliderProps()}>
      <ContainerAsideInner>
        <div className="info">
          <img className="info__logo" src={logoImg} alt="Banner" />
          <h3 className="info__title">个人博客</h3>
        </div>

        <AsideMenu />
      </ContainerAsideInner>
    </Layout.Sider>
  )
})

export default ContainerAside
