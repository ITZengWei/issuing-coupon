import axios, { AxiosRequestConfig } from 'axios'
export const LOCAL_TOKEN_KEY = 'coupon_token'

const request = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  // baseURL: 'http://localhost:3099/',
  baseURL: 'http://api_coupon.smalllb.top/',
})

/** 设置请求拦截器 */

request.interceptors.request.use((config: AxiosRequestConfig) => {
  /** 获取是否存在 token */

  const localToken = window.localStorage.getItem(LOCAL_TOKEN_KEY)

  if (localToken) {
    config.headers.Authorization = 'Bearer ' + localToken
  }

  return config
})

export default request
