import request from '../utils/request'
import { PageQueryParams } from './types'

/** 相册模块请求Url集合 */
export enum AlbumUrls {
  createAlbum = '/albums/create',
  removeAlbum = '/albums',
  updateAlbum = '/albums',
  fetchAlbums = '/albums/fetch',
}

/** 增加相册所传参数接口 */
export interface CreateAlbumParams {
  /** 备注 */
  remark: string

  /** 图景 */
  prospect: string
}

/** 增加相册 */
export function createAlbum<T = any>(payload: CreateAlbumParams) {
  return request<T>({
    url: AlbumUrls.createAlbum,
    method: 'POST',
    data: payload,
  })
}

/** 删除相册 */
export function removeAlbum<T = any>(albumId: string) {
  return request<T>({
    url: `${AlbumUrls.removeAlbum}/${albumId}`,
    method: 'DELETE',
  })
}

/** 修改相册 */
export function updateAlbum<T = any>(
  albumId: string,
  payload: CreateAlbumParams,
) {
  let sendParams = {
    id: albumId,
    ...payload,
  }

  return request<T>({
    url: AlbumUrls.updateAlbum,
    method: 'PUT',
    data: sendParams,
  })
}

/** 获取相册所传参数接口 */
export interface FetchAlbumParams extends PageQueryParams {}

/** 获取相册列表 */
export function fetchAlbums<T = any>(payload: FetchAlbumParams) {
  return request<T>({
    url: AlbumUrls.fetchAlbums,
    method: 'POST',
    data: payload,
  })
}
