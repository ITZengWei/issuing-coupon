import request from '../utils/request'

/** 文件模块请求Url集合 */
export enum FileUrls {
  uploadFile2aly = '/upload',
}

/* 上传图片到阿里云 */
export function uploadFile2aly<T = any>(file: File) {
  const formData = new FormData()
  formData.append('image', file)

  return request<T>({
    url: FileUrls.uploadFile2aly,
    method: 'POST',
    data: formData,
  })
}
