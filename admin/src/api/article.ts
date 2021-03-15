import store from '../store/index'
import config from '../config'
import request from '../utils/request'
import { PageQueryParams } from './types'

/** 文章模块请求Url集合 */
export enum ArticleUrls {
  fetchArticleList = '/articles/fetchByUser',
  fetchMyArticleList = '/me_articles',
  fetchArticleDesc = '/articles',
  addArticle = '/articles/add',
  editArticle = '/articles',
  delArticle = '/articles',
  delMoreArticle = '/articles',
}

/**
 * 文章相关接口
 */

/** 获取文章列表所传参数接口 */
export interface FetchArticleListParams extends PageQueryParams {
  /** 根据标题去搜索 */
  title?: string

  /** 根据作者搜索 */
  author?: string

  /** 是否完成 */
  completed?: boolean
}

/** 获取文章列表 */
export function fetchArticleList<T = any>(payload: FetchArticleListParams) {
  payload = Object.assign({}, { pageNum: 1, pageSize: 6 }, payload)

  return request<T>({
    url: ArticleUrls.fetchArticleList,
    method: 'POST',
    data: payload,
  })
}

/** 获取我写的文章 TODO */
export function fetchMyArticleList<T = any>() {
  const userId = store.getState().user.userInfo?._id

  let sendParams = {
    userId: userId!,
  }

  return request<T>({
    url: ArticleUrls.fetchMyArticleList,
    method: 'POST',
    data: sendParams,
  })
}

/** 获取文章详情 */
export function fetchArticleDesc<T = any>(articleId: string) {
  return request<T>({
    url: `${ArticleUrls.fetchArticleDesc}/${articleId}`,
    method: 'GET',
  })
}

/** 添加文章参数 */
export interface AddArticleParams {
  /** 文章标题 */
  title: string
  /** 文章作者 */
  author: string
  /** 文章特色图片，存储图标地址 */
  traitImg: string
  /** 文章分类，存放分类id */
  category: string
  /** 文章标签，存放标签id集合 */
  tags: string[]
  /** 文章内容 HTML字符串 */
  contentHTML: string
  /** 文章内容 Markdown字符串 */
  contentMD: string
  /** 文章总结 */
  summary: string
  /** 完成状态 */
  completed: boolean
}

/** 添加文章列表 */
export function addArticle<T = any>(payload: AddArticleParams) {
  return request<T>({
    url: ArticleUrls.addArticle,
    method: 'POST',
    data: payload,
  })
}

// /** 编辑文章参数 */
// export interface EditArticleParams extends  {}

/** 编辑文章列表 */
export function editArticle<T = any>(
  articleId: string,
  payload: Partial<AddArticleParams>,
) {
  let sendParams = {
    id: articleId,
    ...payload,
  }

  return request<T>({
    url: ArticleUrls.editArticle,
    method: 'PUT',
    data: sendParams,
  })
}

/** 根据文章id删除文章 */
export function delArticle<T = any>(articleId: string) {
  return request<T>({
    url: `${ArticleUrls.delArticle}/${articleId}`,
    method: 'DELETE',
  })
}

/** 批量删除文章列表 */
export function delMoreArticle<T = any>(articleIds: string[]) {
  return request<T>({
    url: `${ArticleUrls.delMoreArticle}/${articleIds.join(
      config.API_SPLIT_ARRAY_ALPHA,
    )}`,
    method: 'DELETE',
  })
}

/** 删除文章接口(方法重写) */
// interface IDeleteArticle {
//   (articleId: string) => void
// }

/** 根据参数派发不同的删除接口 */
export function deleteArticle(params: string[] | string) {
  if (typeof params === 'string') {
    return delArticle(params)
  }

  return delMoreArticle(params)
}
