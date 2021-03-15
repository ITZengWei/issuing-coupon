import request from '../utils/request'
import { PageQueryParams } from './types'
import { IUserType } from '../store/module/user/reducer'

/** 菜单模块请求Url集合 */
export enum MenuUrls {
  createMenu = '/menus/useCreate',
  removeMenu = '/menus/useRemove',
  updateMenu = '/menus/useUpdate',
  fetchMenus = '/menus/useFind',
  fetchMenuTree = '/menus/tree',
  fetchAsideMenus = '/menus/aside',
}

/**
 * 菜单相关接口
 */

/** 根据菜单id删除菜单(以及附属的子菜单) */
export function removeMenu<T = any>(menuIds: string[]) {
  return request<T>({
    url: MenuUrls.removeMenu,
    method: 'DELETE',
    data: menuIds,
  })
}

export interface CreateMenuPayload {
  /** 菜单路径 */
  path: string

  /** 菜单名称 */
  title: string

  /** 菜单图标 */
  icon: any

  /** 菜单位置索引 */
  index: number

  /** 父级 id */
  parentId?: string

  /** 上级菜单id */
  topIds: string[]

  /** 权限 */
  auth: IUserType[]
}

/** 增加菜单 */
export function createMenu<T = any>(payload: CreateMenuPayload) {
  return request<T>({
    url: MenuUrls.createMenu,
    method: 'POST',
    data: payload,
  })
}

export interface UpdateMenuPayload extends Partial<CreateMenuPayload> {}

/** 修改菜单 */
export function updateMenu<T = any>(
  menuId: string,
  payload: UpdateMenuPayload,
) {
  let sendParams = {
    ...payload,
    id: menuId,
  }

  return request<T>({
    url: MenuUrls.updateMenu,
    method: 'PUT',
    data: sendParams,
  })
}

/** 获取菜单数据 */
export function fetchMenus<T = any>(payload: PageQueryParams) {
  payload = Object.assign({}, { pageNum: 1, pageSize: 1000 }, payload)

  return request<T>({
    url: MenuUrls.fetchMenus,
    method: 'POST',
    data: payload,
  })
}

/** 获取侧边栏菜单 */
export function fetchAsideMenus<T = any>(userType: IUserType) {
  return request<T>({
    url: MenuUrls.fetchAsideMenus,
    method: 'POST',
    data: { userType },
  })
}

/** 获取三种不同的菜单树 (基础、普通、管理员) */
export function fetchMenuTree<T = any>() {
  return request<T>({
    url: MenuUrls.fetchMenuTree,
    method: 'GET',
  })
}
