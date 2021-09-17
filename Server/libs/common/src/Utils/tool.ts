import { ResponseResult } from '@app/common/Results/response.result'
import { ResultCode } from '@app/common/Results/code.result'

// 用户传过来的 try 函数体
let tryCatchTarget: Function

async function tryCatcher(this: any): Promise<any> {

  try {
    return await tryCatchTarget()
  } catch (e) {
    return new ResponseResult(ResultCode.other, e.message)
  } finally {
    tryCatchTarget = undefined
  }
}

export async function myTryCatch<T extends Function>(fn: T): Promise<T> {
  tryCatchTarget = fn
  return await <any>tryCatcher()
}
