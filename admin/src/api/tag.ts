import request from '../utils/request'

/** 标签模块请求Url集合 */
export enum TagUrls {
  createTag = '/tags/add',
  removeTag = '/tags',
  fetchTags = '/tags/fetch',
}

/* 增加标签 */
export function createTag<T = any>(tagName: string) {
  return request<T>({
    url: TagUrls.createTag,
    method: 'POST',
    data: tagName,
  })
}

/* 删除标签 */
export function removeTag<T = any>(tagId: string) {
  return request<T>({
    url: `${TagUrls.removeTag}/${tagId}`,
    method: 'DELETE',
  })
}

/* 获取标签列表 */
export function fetchTags<T = any>() {
  let sendParams = {
    pageNum: 1,
    pageSize: 100,
  }

  return request<T>({
    url: TagUrls.fetchTags,
    method: 'POST',
    data: sendParams,
  })
}
