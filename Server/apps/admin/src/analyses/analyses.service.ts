import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType, DocumentType } from '@typegoose/typegoose'
import { ResultCode } from '@app/common/Results/code.result'
import { ResponseResult } from '@app/common/Results/response.result'
import { UserModel } from 'libs/db/models/user.model'

interface ArticleGroupResponseData {
  /** 分类名称 */
  category: string

  /** 数量 */
  count: number

  /** 是否完成 */
  completed: boolean
}

@Injectable()
export class AnalysesService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
  ) {}

  /** 获取头部卡片数据 */
  async fetchTopCardData(userId: any) {}

  /** 获取用户文章发表概览数据 */
  async fetchUserArticle(userId: any) {}

  /** 获取文章分组数据 */
  async fetchArticleGroupData(userId: any) {}
}
