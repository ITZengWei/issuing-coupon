import request from '../utils/request'

/** 分类模块请求Url集合 */
export enum CategoryUrls {
  createCategory = '/categories',
  removeCategory = '/categories',
  updateCategory = '/categories',
  fetchCategories = '/categories/findAll',
}

interface ICreateCategory {
  /** 分类名 */
  name: string

  /** 父级分类 */
  parentCategory?: string

  /** 父级以上分类集合 1， 2，3,4 */
  grandparentCategory?: string
}

/* 增加分类 */
export function createCategory<T = any>(payload: ICreateCategory) {
  return request<T>({
    url: CategoryUrls.createCategory,
    method: 'POST',
    data: payload,
  })
}

/* 删除分类 */
export function removeCategory<T = any>(categoryId: string) {
  return request<T>({
    url: `${CategoryUrls.removeCategory}/${categoryId}`,
    method: 'DELETE',
  })
}

/* 修改分类 */
export function updateCategory<T = any>(categoryId: string, newName: string) {
  return request<T>({
    url: CategoryUrls.updateCategory,
    method: 'PUT',
    data: {
      id: categoryId,
      name: newName,
    },
  })
}

/* 获取分类列表 */
export function fetchCategories<T = any>() {
  let sendParams = {
    pageNum: 1,
    pageSize: 100,
  }

  return request<T>({
    url: CategoryUrls.fetchCategories,
    method: 'POST',
    data: sendParams,
  })
}
