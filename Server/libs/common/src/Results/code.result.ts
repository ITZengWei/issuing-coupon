export enum ResultCode  {
  success = 200, // 成功
  forbidden = 403,  // 服务器拒绝执行 (token 过期)
  params = 501, // 用户参数错误
  error = 500, // 服务端错误

  other = -1 // 其他错误
}