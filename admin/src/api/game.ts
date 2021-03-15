import request from '../utils/request'
import { PageQueryParams } from './types'

/** 游戏模块请求Url集合 */
export enum AlbumUrls {
  createGame = '/games/create',
  removeGame = '/games',
  updateGame = '/games',
  fetchGames = '/games/fetch',
}

/** 增加游戏所传参数接口 */
export interface CreateGameParams {
  /** 封面 */
  cover: string

  /** 备注 */
  remark: string

  /** 来源 */
  origin: string

  /** 链接 */
  link: string
}

/** 增加游戏 */
export function createGame<T = any>(payload: CreateGameParams) {
  return request<T>({
    url: AlbumUrls.createGame,
    method: 'POST',
    data: payload,
  })
}

/** 删除游戏 */
export function removeGame<T = any>(albumId: string) {
  return request<T>({
    url: `${AlbumUrls.removeGame}/${albumId}`,
    method: 'DELETE',
  })
}

/** 修改游戏 */
export function updateGame<T = any>(
  albumId: string,
  payload: CreateGameParams,
) {
  let sendParams = {
    id: albumId,
    ...payload,
  }

  return request<T>({
    url: AlbumUrls.updateGame,
    method: 'PUT',
    data: sendParams,
  })
}

/** 获取游戏所传参数接口 */
export interface FetchAlbumParams extends PageQueryParams {}

/** 获取游戏列表 */
export function fetchGames<T = any>(payload: FetchAlbumParams) {
  payload = Object.assign({}, { pageNum: 1, pageSize: 1000 }, payload)

  return request<T>({
    url: AlbumUrls.fetchGames,
    method: 'POST',
    data: payload,
  })
}
