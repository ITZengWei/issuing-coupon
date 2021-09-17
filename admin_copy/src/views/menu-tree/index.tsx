import { FC, memo, useEffect, useState } from 'react'
import { Card, Tree, Row, Col, Skeleton } from 'antd'
import { DataNode } from 'antd/lib/tree'
import { DownOutlined } from '@ant-design/icons'
import { CSSProperties } from 'styled-components'
import { fetchMenuTree, IMockMenuData } from '../../api/menu'
import { arr2menu, getAntdIconByIconStr } from '../../utils/menu'

interface ResponseMenuTreeData {
  common: any[]
  admin: any[]
  superAdmin: any[]
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
function formatData(menus: any[]): DataNode[] {
  return menus.map(menu => {
    const { path, title, children, icon } = menu
    return {
      key: path,
      title,
      icon,
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
  menus: any[]

  /** 额外菜单 */
  extraMenus?: any[]
}

const MenuTreeItem: FC<MenuTreeItemProps> = memo(props => {
  const { menus, title, isLoading, extraMenus } = props

  const cardBodyStyle: CSSProperties = { height: 466 }

  // const renderMenus = extraMenus ? menus.concat(extraMenus) : menus

  /** 菜单数数据 */
  const menuTree = formatData(
    arr2menu(extraMenus ? [...extraMenus, ...menus] : [...menus]),
  )

  return (
    <Card bodyStyle={cardBodyStyle} bordered={false} title={title}>
      {isLoading ? (
        <MenuSkeleton />
      ) : (
        <Tree
          treeData={menuTree}
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
  const [menus, setMenus] = useState<IMockMenuData>({
    common: [],
    systemAdmin: [],
    couponAdmin: [],
    readyCompany: [],
    company: [],
  })

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchMenuTree().then((res: any) => {
      setMenus(res)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8} xs={24} md={12} xl={8}>
          <MenuTreeItem
            menus={menus.common}
            isLoading={isLoading}
            title="公共菜单"
          />
        </Col>
        <Col span={8} xs={24} md={12} xl={8}>
          <MenuTreeItem
            menus={menus.systemAdmin}
            isLoading={isLoading}
            extraMenus={menus.common}
            title="系统管理员"
          />
        </Col>
        <Col span={8} xs={24} md={12} xl={8}>
          <MenuTreeItem
            isLoading={isLoading}
            title="优惠券管理员"
            menus={menus.couponAdmin}
            extraMenus={menus.common}
          />
        </Col>
        <Col span={8} xs={24} md={12} xl={8}>
          <MenuTreeItem
            isLoading={isLoading}
            title="认证完成商家"
            menus={menus.company}
            extraMenus={menus.common}
          />
        </Col>
        <Col span={8} xs={24} md={12} xl={8}>
          <MenuTreeItem
            isLoading={isLoading}
            title="等待认证商家"
            menus={menus.readyCompany}
            extraMenus={menus.common}
          />
        </Col>
      </Row>
    </div>
  )
})

export default MenuTree
