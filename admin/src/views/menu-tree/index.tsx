import { FC, memo, useEffect, useState } from 'react'
import { Card, Tree, Row, Col, Skeleton } from 'antd'
import { DataNode } from 'antd/lib/tree'
import { DownOutlined } from '@ant-design/icons'
import { CSSProperties } from 'styled-components'
import { fetchMenuTree } from '../../api/menu'
import { MenuData } from '../menu-list'
import { ResponseMenuItemData } from '../menu-list'
import { arr2menu, getAntdIconByIconStr } from '../../utils/menu'

interface ResponseMenuTreeData {
  common: ResponseMenuItemData[]
  admin: ResponseMenuItemData[]
  superAdmin: ResponseMenuItemData[]
}

/** 菜单骨架屏 */
const MenuSkeleton: FC = memo(() => {
  const middleStyle: CSSProperties = {
    marginLeft: 10,
    marginRight: 8,
  }

  return (
    <div>
      {new Array(5).fill(null).map((v, i) => {
        return (
          <div style={{ marginBottom: 5 }} key={i}>
            <Skeleton.Avatar className="icon" active size={16} />
            <Skeleton.Avatar
              className="icon"
              active
              size={16}
              style={middleStyle}
            />
            <Skeleton.Input
              className="text"
              active
              style={{ width: 200 }}
              size="small"
            />
          </div>
        )
      })}
    </div>
  )
})

/** 格式化菜单数据 */
function formatData(menus: MenuData[]): DataNode[] {
  return menus.map(menu => {
    const { path, title, children, icon } = menu
    return {
      key: path,
      title,
      icon: getAntdIconByIconStr(icon),
      children: children && formatData(children),
    }
  })
}

interface MenuTreeItemProps {
  /** 卡片标题 */
  title: string

  /** 菜单数据是否正在加载 */
  isLoading: boolean

  /** 菜单数据 */
  menus: MenuData[]
}

const MenuTreeItem: FC<MenuTreeItemProps> = memo(props => {
  const { menus, title, isLoading } = props

  const cardBodyStyle: CSSProperties = { height: 466 }

  return (
    <Card bodyStyle={cardBodyStyle} bordered={false} title={title}>
      {isLoading ? (
        <MenuSkeleton />
      ) : (
        <Tree
          treeData={formatData(menus)}
          height={366}
          showIcon
          icon={null}
          switcherIcon={<DownOutlined />}
        />
      )}
    </Card>
  )
})

const MenuTree: FC = memo((props: any) => {
  /** 菜单数据 */
  const [commonMenus, setCommonMenus] = useState<MenuData[]>([])
  const [adminMenus, setAdminMenus] = useState<MenuData[]>([])
  const [superAdminMenus, setSuperAdminMenus] = useState<MenuData[]>([])

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchMenuTree<ResponseMenuTreeData>().then(res => {
      const { common, admin, superAdmin } = res.data.data
      setCommonMenus(arr2menu(common))
      setAdminMenus(arr2menu(admin))
      setSuperAdminMenus(arr2menu(superAdmin))
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8} xs={24} md={12} xl={8}>
          <MenuTreeItem
            menus={commonMenus}
            isLoading={isLoading}
            title="公共菜单"
          />
        </Col>
        <Col span={8} xs={24} md={12} xl={8}>
          <MenuTreeItem
            isLoading={isLoading}
            title="普通用户展示菜单"
            menus={adminMenus}
          />
        </Col>
        <Col span={8} xs={24} md={12} xl={8}>
          <MenuTreeItem
            isLoading={isLoading}
            title="管理员展示菜单"
            menus={superAdminMenus}
          />
        </Col>
      </Row>
    </div>
  )
})

export default MenuTree
