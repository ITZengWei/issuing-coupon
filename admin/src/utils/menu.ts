import * as AntdIcon from '@ant-design/icons/lib/icons'
import { createElement, ReactNode } from 'react'
import { ResponseMenuItemData } from '../views/menu-list'
import { IAsideMenu } from './../components/container/container-aside'
import { combineURL } from './tool'

/** 获取扁平化的菜单 */
export const getFlattenMenus = (menuData: IAsideMenu[]) => {
  return menuData.reduce<IAsideMenu[]>((result, menu) => {
    result.push(menu)
    if (menu.children) {
      result = result.concat(getFlattenMenus(menu.children))
    }
    return result
  }, [])
}

/** 将 url 转换为 url数组 (/a/b/c => ['/a', '/b', '/c'])*/
export const url2paths = (url: string) => {
  /** 根据 / 分割 url(并且去除第一个 / ) ['a', 'b', 'c'] */
  const paths = url.slice(1).split('/')

  /** 为每一个成员前面添加一个 '/' */
  return paths.map((item, index) => '/' + paths.slice(0, index + 1).join('/'))
}

type combineMenuType = (
  menu1: IAsideMenu[],
  menu2: IAsideMenu[],
) => IAsideMenu[]

/** 合并拼接菜单 */
export const combineMenu: combineMenuType = (menu1, menu2) => {
  return [/* ...menu1,  */ ...menu2]
}

type formatMenuPathType = (
  menus: IAsideMenu[],
  parentPath?: string,
) => IAsideMenu[]

/** 格式化菜单路径 */
export const formatMenuPath: formatMenuPathType = (menus, parentPath) => {
  if (parentPath === undefined) {
    parentPath = '/'
  }
  return menus.map(menu => {
    const result = {
      ...menu,
      path: combineURL(parentPath!, menu.path),
    }
    if (menu.children) {
      result.children = formatMenuPath(
        menu.children,
        combineURL(parentPath!, menu.path),
      )
    }
    return result
  })
}

/** 将菜单数据转换可渲染数据 */
export function arr2menu(arr: ResponseMenuItemData[]): IAsideMenu[] {
  const asideMenus: IAsideMenu[] = []

  /** 遍历获取顶级节点 */
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    /** 有父级 id 代表不是顶级菜单 */
    if (item.parentId) continue
    asideMenus.push(transformMenuItem(item))
    /** 在上面一步，我们拿到了菜单数据，为了减少遍历，我们设置为null */
    arr[i] = null as any
  }

  /** 转移到上级菜单 top 中 */
  function transferTopMenu(
    menus: Array<ResponseMenuItemData | null>,
    topMenu: IAsideMenu,
  ) {
    /** 递归出口 */
    if (menus.filter(menu => menu !== null).length === 0) return

    /** 判断菜单的parentId 是否和我们的 topMenu相同，相同的话，将结果 push 到topMenu 的children中 */
    for (let i = 0; i < menus.length; i++) {
      const item = menus[i]
      if (item === null) continue

      if (item.parentId === topMenu._id!) {
        if (typeof topMenu.children === 'undefined') {
          topMenu.children = []
        }
        const child = transformMenuItem(item)

        topMenu.children.push(child)

        menus[i] = null as any

        transferTopMenu(menus, child)
      }
    }
  }

  asideMenus.forEach(topMenu => transferTopMenu(arr, topMenu))

  /** 排序 */
  asideMenus.sort((a, b) => a.index - b.index)

  return asideMenus
}

/** 转换为菜单项数据 */
function transformMenuItem(item: ResponseMenuItemData): IAsideMenu {
  let { _id, title, path, icon, topIds, auth, index } = item
  const result = {
    _id,
    title,
    path,
    topIds,
    auth,
    index,
    icon,
  } as IAsideMenu

  // if (icon) {
  //   result.icon = (AntdIcon as any)[icon]
  // }

  return result
}

/** 获取删除菜单的菜单集合(自身菜单 + 子类菜单) */
export function getRemoveMenuIds(menu: IAsideMenu): string[] {
  const { topIds, _id } = menu
  return [_id!, ...topIds!]
}

/** 获取Antd Icon */
export function getAntdIcon(icon: any) {
  // return createElement(icon)
  if (icon && icon.render) {
    return icon.render()
  }
  return null
}

/** 根据图标字符串获取 antdIcon */
export function getAntdIconByIconStr(icon?: string): null | ReactNode {
  if (typeof icon === 'undefined') return null

  return getAntdIcon((AntdIcon as any)[icon])
}
