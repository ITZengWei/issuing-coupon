import request from '../utils/request'
import { PageQueryParams } from './types'

/** 书签模块请求Url集合 */
export enum BookmarkUrls {
  createBookmarkColumn = '/bookmarks/createColumn',
  removeBookmarkColumn = '/bookmarks/removeColumn',
  updateBookmarkColumn = '/bookmarks/updateColumn',
  fetchBookmarkColumn = '/bookmarks/fetchColumns',
  fetchColumnWithMark = '/bookmarks/fetchColumnWithMark',
  createBookmark = '/bookmarks/create',
  removeBookmark = '/bookmarks',
  updateBookmark = '/bookmarks/update',
}

/** 书签数据 */
export interface BookmarkData {
  _id: string

  /** 书签封面图 */
  cover?: string

  /** 书签文案 */
  label: string

  /** 地址 */
  url: string

  /** 书签序号 */
  index: number

  /** 书签栏目 */
  columnId: string
}

export const mockData: BookmarkData[] = [
  {
    _id: 'bookmark_1',
    cover: 'https://vue3js.cn/docs/logo.png',
    label: 'Vue3官方文档',
    url: 'https://vue3js.cn/docs/zh/',
    index: 1,
    columnId: 'column_1',
  },
  {
    _id: 'bookmark_2',
    cover:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
    label: 'React官方文档',
    url: 'https://react.docschina.org/docs/getting-started.html',
    index: 2,
    columnId: 'column_2',
  },
  {
    _id: 'bookmark_3',
    cover: 'https://vue3js.cn/docs/logo.png',
    label: 'Vue3官方文档',
    url: 'https://vue3js.cn/docs/zh/',
    index: 1,
    columnId: 'column_1',
  },
  {
    _id: 'bookmark_4',
    cover:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
    label: 'React官方文档',
    url: 'https://react.docschina.org/docs/getting-started.html',
    index: 2,
    columnId: 'column_2',
  },
  {
    _id: 'bookmark_5',
    cover: 'https://vue3js.cn/docs/logo.png',
    label: 'Vue3官方文档',
    url: 'https://vue3js.cn/docs/zh/',
    index: 1,
    columnId: 'column_1',
  },
  {
    _id: 'bookmark_6',
    cover:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
    label: 'React官方文档',
    url: 'https://react.docschina.org/docs/getting-started.html',
    index: 2,
    columnId: 'column_2',
  },
]

/** 书签栏目数据 */
export interface BookmarkColumnData {
  _id: string

  /** 栏目图标 */
  icon: string

  /** 栏目名称 */
  name: string

  /** 栏目索引 */
  index: number

  /** 栏目所属书签 */
  bookmarks: Array<BookmarkData>
}

/**
 * 书栏相关接口
 */

export interface CreateBookmarkColumnPayload {
  /** 书栏名称 */
  name: string

  /** 书栏图标 */
  icon: string
}

/** 增加书栏 */
export function createBookmarkColumn<T = any>(
  payload: CreateBookmarkColumnPayload,
) {
  return request<T>({
    url: BookmarkUrls.createBookmarkColumn,
    method: 'POST',
    data: payload,
  })
}

/** 删除书栏(以及书栏附属书签) */
export function removeBookmarkColumn<T = any>(bookmarkColumnId: string) {
  return request<T>({
    url: `${BookmarkUrls.removeBookmarkColumn}/${bookmarkColumnId}`,
    method: 'DELETE',
  })
}

export interface UpdateBookmarkColumnPayload {
  /** 书栏名称 */
  name?: string

  /** 书栏图标 */
  icon?: string

  /** 书栏索引 */
  index?: number
}

/** 修改书栏 */
export function updateBookmarkColumn<T = any>(
  bookmarkColumnId: string,
  payload: UpdateBookmarkColumnPayload,
) {
  const sendParamas = { id: bookmarkColumnId, ...payload }
  return request<T>({
    url: BookmarkUrls.updateBookmarkColumn,
    method: 'PATCH',
    data: sendParamas,
  })
}

/** 获取书栏 */
export function fetchBookmarkColumn<T = any>(payload: PageQueryParams) {
  payload = Object.assign({}, { pageNum: 1, pageSize: 1000 }, payload)

  return request<T>({
    url: BookmarkUrls.fetchBookmarkColumn,
    method: 'POST',
    data: payload,
  })
}

// /** 更改书栏索引 */
// export function exchangeBookmarkColumn({}) {

// }

/**
 * 书签相关接口
 */

/** 获取书栏以及书签 */
export function fetchColumnWithMark<T = any>() {
  return request<T>({
    url: BookmarkUrls.fetchColumnWithMark,
    method: 'GET',
  })
}

export interface CreateBookmarkPayload {
  /** 书签标题 */
  label: string

  /** 书签封面 */
  cover: string

  /** 书签地址 */
  url: string

  /** 书签索引 */
  index: number

  /** 所属书栏Id */
  column: string
}

/** 增加书签 */
export function createBookmark<T = any>(payload: CreateBookmarkPayload) {
  return request<T>({
    url: BookmarkUrls.createBookmark,
    method: 'POST',
    data: payload,
  })
}

/** 删除书签 */
export function removeBookmark<T = any>(bookmarkId: string) {
  return request<T>({
    url: `${BookmarkUrls.removeBookmark}/${bookmarkId}`,
    method: 'DELETE',
  })
}

export interface UpdateBookmarkPayload {
  /** 书签标题 */
  label?: string

  /** 书签封面 */
  cover?: string

  /** 书签地址 */
  url?: string

  /** 书栏索引 */
  index?: number
}

/** 修改书签 */
export function updateBookmark<T = any>(
  bookmarkId: string,
  payload: UpdateBookmarkPayload,
) {
  const sendParams = { id: bookmarkId, ...payload }

  return request<T>({
    url: BookmarkUrls.updateBookmark,
    method: 'PATCH',
    data: sendParams,
  })
}
