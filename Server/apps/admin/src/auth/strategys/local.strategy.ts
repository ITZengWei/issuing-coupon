import { PassportStrategy } from '@nestjs/passport'
import { Strategy, IStrategyOptions } from 'passport-local'
import { InjectModel } from 'nestjs-typegoose'
import { BadRequestException } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { compareSync } from 'bcryptjs'
import {
  IUserType,
  UserDocumentType,
  UserModel,
} from 'libs/db/models/user.model'
import { StoreModel } from 'libs/db/models/store.model'
import { myTryCatch } from '@app/common/Utils/tool'

/* 本地策略  */
export class LocalStrategy extends PassportStrategy(Strategy, 'admin_local') {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    @InjectModel(StoreModel)
    private readonly storeModel: ReturnModelType<typeof StoreModel>,
  ) {
    super({
      usernameField: 'account',
      passwordField: 'psw',
    } as IStrategyOptions)
  }

  /** 生成商铺信息 */
  async genderCompanyInfo(user: UserDocumentType) {
    const { _id: userId, type } = user
    /** 商铺信息 */
    const companyInfo = { store: null }

    // 如果是商家把商家信息放入进去
    if (type === IUserType.company) {
      const vo = {
        audit: '1',
        isFreeze: '1',
        storeName: '1',
        logo: '1',
        license: '1',
        province: '1',
        city: '1',
        name: '1',
        idCard: '1',
      }
      const store = await this.storeModel.findOne({ userId }, vo).lean()

      companyInfo.store = store
    }

    return companyInfo
  }

  async validate(account, psw) {
    const user = await this.userModel
      .findOne(
        {
          $or: [{ account: account }, { tel: account }],
        },
        { _id: '1', account: '1', type: '1' },
      )
      .select('+psw')
      .lean()

    if (!user) {
      throw new BadRequestException('用户名不存在')
    }
    if (!compareSync(psw, user.psw)) {
      throw new BadRequestException('用户名密码错误')
    }

    const companyInfo = await this.genderCompanyInfo(user as any)

    return Object.assign({}, user, companyInfo)
  }
}
