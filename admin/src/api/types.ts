/** 分页查找参数 */
export interface PageQueryParams {
  /** 当前页 */
  pageNum?: number

  /** 每页多少条数据 */
  pageSize?: number
}

/** 响应数据带有count */
export interface WithCountResponseData<T = any> {
  count: number
  list: T
}
