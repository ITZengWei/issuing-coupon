import { Injectable } from '@nestjs/common';
import {ResponseResult} from "@app/common/Results/response.result";
import {ResultCode} from "@app/common/Results/code.result";

@Injectable()
export class FilesService {
  async upload(file) {
    if (!file) {
      return new ResponseResult(ResultCode.other, null, '请上传图片')
    }

    return new ResponseResult(ResultCode.success, file)
  }
}
