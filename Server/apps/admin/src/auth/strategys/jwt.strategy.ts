import { PassportStrategy } from '@nestjs/passport'
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { InjectModel } from 'nestjs-typegoose'
import { BadRequestException } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { IUserType, UserModel } from 'libs/db/models/user.model'
import { StoreModel } from 'libs/db/models/store.model'
import { myTryCatch } from '@app/common/Utils/tool'
import { LocalStrategy } from './local.strategy';

export class JwtStrategy extends PassportStrategy(Strategy, 'admin_jwt') {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    @InjectModel(StoreModel)
    private readonly storeModel: ReturnModelType<typeof StoreModel>,
    private readonly LocalStrategy: LocalStrategy
  ) {
    super({
      secretOrKey: process.env.SECRET || 'xiaolibingzengweiyongyuanaini',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    } as StrategyOptions)
  }

  async validate(result) {
    return await myTryCatch(async () => {
      let { id } = result
      const user = await this.userModel
        .findById(id, { _id: '1', account: '1', type: '1' })
        .lean()

      /** 商铺信息 */
      const companyInfo = await this.LocalStrategy.genderCompanyInfo(user as any)

      return Object.assign({}, user, companyInfo)
    })
  }
}
