import request from '../utils/request'

/** 分析模块请求Url集合 */
export enum AnalyseUrls {
  fetchTopCardData = 'analyses/topData',
  fetchArticleGroupData = 'analyses/articleGroup',
  fetchIncrementData = 'analyses/incrementLine',
  fetchUserArticleData = 'analyses/userArticle',
}

export interface TopCardResponseData {
  /** 文章数 */
  article: number

  /** 待办(done: wanc, total: 总数) */
  todo: { done: number; total: number }

  /** 记录行数 */
  record: number

  /** 书签个数 */
  bookmark: number
}

/** 获取头部卡片数据 */
export function fetchTopCardData() {
  return request<TopCardResponseData>({
    url: AnalyseUrls.fetchTopCardData,
    method: 'GET',
  })
}

/** 饼图数据 */
export interface ArticleGroupDataWithPie {
  /** 分类名称 */
  category: string

  /** 数量 */
  count: number
}

/** 柱形图图数据 */
export interface ArticleGroupDataWithColumn {
  /** 分类名称 */
  category: string

  /** 数量 */
  count: number

  /** 发布类型 草稿 | 已发布 */
  type: 'draft' | 'publish'
}

export interface ArticleGroupResponseData {
  column: Array<ArticleGroupDataWithColumn>
  pie: Array<ArticleGroupDataWithPie>
}

/** 获取文章数据 */
export function fetchArticleGroupData() {
  return request<ArticleGroupResponseData>({
    url: AnalyseUrls.fetchArticleGroupData,
    method: 'GET',
  })
}

/** 获取增长效果数据 */
export function fetchIncrementData<T = any>() {
  return request<T>({
    url: AnalyseUrls.fetchIncrementData,
    method: 'GET',
  })
}

// interface UserArticleResponseData {}
export type UserArticleResponseData = Array<{ account: string; total: number }>

/** 获取用户文章发表概览数据 */
export function fetchUserArticleData() {
  return request({
    url: AnalyseUrls.fetchUserArticleData,
    method: 'GET',
  })
}
