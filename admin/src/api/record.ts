import request from '../utils/request'
import { PageQueryParams } from './types'

/** 记录模块请求Url集合 */
export enum RecordUrls {
  createRecord = '/records',
  removeRecord = '/records',
  updateRecord = '/records',
  fetchRecords = '/records/findAll',
}

/** 增加记录 */
export function createRecord<T = any>(content: string) {
  return request<T>({
    url: RecordUrls.createRecord,
    method: 'POST',
    data: { content },
  })
}

/** 删除记录 */
export function removeRecord<T = any>(recordId: string) {
  return request<T>({
    url: `${RecordUrls.removeRecord}/${recordId}`,
    method: 'DELETE',
  })
}

/** 修改记录 */
export function updateRecord<T = any>(recordId: string, content: string) {
  let sendParams = {
    content,
    id: recordId,
  }

  return request<T>({
    url: RecordUrls.updateRecord,
    method: 'PUT',
    data: sendParams,
  })
}

/** 获取记录列表 */
export function fetchRecords<T = any>(payload: PageQueryParams) {
  payload = Object.assign({}, { pageNum: 1, pageSize: 1000 }, payload)

  return request<T>({
    url: RecordUrls.fetchRecords,
    method: 'POST',
    data: payload,
  })
}
