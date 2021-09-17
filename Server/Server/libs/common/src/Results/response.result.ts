import { ResultCode } from './code.result'


export class ResponseResult<T = any> {
  private code: ResultCode
  private data: T
  private msg?: string
  constructor(code: ResultCode, data: T, msg?: string) {
    this.code = code
    this.data = data
    this.msg = msg
  }
}