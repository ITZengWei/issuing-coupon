import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { IUserGender, IUserType, UserModel } from 'libs/db/models/user.model'
import { myTryCatch } from '@app/common/Utils/tool'
import { ResponseResult } from '@app/common/Results/response.result'
import { ResultCode } from '@app/common/Results/code.result'
import { AddSystemAdminUserDto } from './dtos/add-system-admin-user.dto'
import { AddCouponAdminUserDto } from './dtos/add-coupon-admin-user.dto'
import { AddStoreUserDto } from './dtos/add-store-user.dto'
import {
  defaultStoreData,
  IAudit,
  StoreModel,
} from 'libs/db/models/store.model'
import { CompleteStoreUserDto } from './dtos/complete-store-user.dto'
import { LocalStrategy } from '../auth/strategys/local.strategy'

import formStrategy from '@app/common/Utils/validator'
import { AuditStoreUserDto } from './dtos/audit-store-user.dto'
import { FreezeStoreUserDto } from './dtos/freeze-store-user.dto';
import { AddCommonUserDto } from './dtos/add-common-user.dto';
import { ChangeBaseInfoDto } from './dtos/change-base-info.dto';

const { useStrategy } = formStrategy

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    @InjectModel(StoreModel)
    private readonly storeModel: ReturnModelType<typeof StoreModel>,
    private readonly LocalStrategy: LocalStrategy,
  ) {}

  /** 管理员获取用户列表 */
  async findAllUser() {
    return await myTryCatch(async () => {
      const users = await this.userModel.find({}).lean()

      for (let i = 0; i < users.length; i++) {
        const companyInfo = await this.LocalStrategy.genderCompanyInfo(
          users[i] as any,
        )
        Object.assign(users[i], companyInfo)
      }

      return new ResponseResult(ResultCode.success, users, '获取成功')
    })
  }

  /** 是否存在用户 */
  async isExitsUser(account: string, tel: number) {
    return myTryCatch(async () => {
      // 判断有没有 这个用户
      const user = await this.userModel.findOne({
        $or: [{ account: account }, { tel: String(tel) }],
      })
      return Boolean(user)
    })
  }

  /** 添加商铺用户 */
  async addStoreUser(dto: AddStoreUserDto) {
    const { account, password, tel } = dto

    if (!useStrategy('validTel', String(tel))) {
      return new ResponseResult(ResultCode.params, null, '请填写正确手机号')
    }

    return await myTryCatch(async () => {
      /** 1. 判断是否存在 */
      if (await this.isExitsUser(account, tel)) {
        return new ResponseResult(
          ResultCode.params,
          null,
          '用户名或者手机号重复',
        )
      }

      /** 2. 添加用户记录 */
      const { _id: userId } = await this.userModel.create({
        account,
        psw: password,
        tel,
        gender: IUserGender.secret,
        type: IUserType.company,
      })

      /** 3. 添加商户记录 */
      await this.storeModel.create({
        ...defaultStoreData,
        userId,
      })

      return new ResponseResult(ResultCode.success, null, '添加商户成功')
    })
  }

  /** 添加普通用户 */
  async addCommonUser(dto: AddCommonUserDto) {
    const { account, password, tel } = dto

    if (!useStrategy('validTel', String(tel))) {
      return new ResponseResult(ResultCode.params, null, '请填写正确手机号')
    }

    return await myTryCatch(async () => {
      /** 1. 判断是否存在 */
      if (await this.isExitsUser(account, tel)) {
        return new ResponseResult(
          ResultCode.params,
          null,
          '用户名或者手机号重复',
        )
      }

      /** 2. 添加用户记录 */
      await this.userModel.create({
        account,
        psw: password,
        tel,
        gender: IUserGender.secret,
        type: IUserType.common,
      })

      return new ResponseResult(ResultCode.success, null, '注册用户成功')
    })
  }

  /** 添加系统卷管理员用户 */
  async addSystemAdminUser(dto: AddSystemAdminUserDto) {
    const { account, password, tel } = dto

    if (!useStrategy('validTel', String(tel))) {
      return new ResponseResult(ResultCode.params, null, '请填写正确手机号')
    }

    return await myTryCatch(async () => {
      /** 1. 判断是否存在 */
      if (await this.isExitsUser(account, tel)) {
        return new ResponseResult(
          ResultCode.params,
          null,
          '用户名或者手机号重复',
        )
      }

      await this.userModel.create({
        account,
        psw: password,
        tel,
        gender: IUserGender.secret,
        type: IUserType.systemAdmin,
      })
      return new ResponseResult(ResultCode.success, null, '添加系统管理员成功')
    })
  }

  /** 添加优惠卷管理员用户 */
  async addCouponAdminUser(dto: AddCouponAdminUserDto) {
    const { account, password, tel } = dto

    if (!useStrategy('validTel', String(tel))) {
      return new ResponseResult(ResultCode.params, null, '请填写正确手机号')
    }

    return await myTryCatch(async () => {
      /** 1. 判断是否存在 */
      if (await this.isExitsUser(account, tel)) {
        return new ResponseResult(
          ResultCode.params,
          null,
          '用户名或者手机号重复',
        )
      }

      await this.userModel.create({
        account,
        psw: password,
        tel,
        gender: IUserGender.secret,
        type: IUserType.couponAdmin,
      })
      return new ResponseResult(
        ResultCode.success,
        null,
        '添加优惠卷管理员成功',
      )
    })
  }

  /** 删除用户 */
  async remove(id) {
    return await myTryCatch(async () => {
      await this.userModel.findByIdAndRemove(id)
      return new ResponseResult(ResultCode.success, null, '删除成功')
    })
  }

  /** 修改用户基础信息 */
  async changeUserBaseInfo(dto: ChangeBaseInfoDto) {
    const { userId, nickname, gender } = dto

    return await myTryCatch(async () => {
      await this.userModel.findByIdAndUpdate(userId, { nickname, gender })

      return new ResponseResult(ResultCode.success, null, '修改成功')
    })
  }

  /** 冻结商铺用户 */
  async freezeStoreUser(dto: FreezeStoreUserDto) {
    const { userId, isFreeze } = dto

    return await myTryCatch(async () => {
      await this.storeModel.findOneAndUpdate({ userId: userId as any }, { isFreeze })

      return new ResponseResult(ResultCode.success, null, '冻结商铺用户成功')
    })
  }

  /** 审核商铺用户 */
  async auditStoreUser(dto: AuditStoreUserDto) {
    const { auditStatus, userId } = dto

    if (![IAudit.agree, IAudit.reject].includes(auditStatus)) {
      return new ResponseResult(
        ResultCode.params,
        null,
        `请填写正确审核状态(同意: ${IAudit.agree}, 拒绝: ${IAudit.reject})`,
      )
    }

    return await myTryCatch(async () => {
      await this.storeModel.findOneAndUpdate(
        { userId: userId as any },
        { audit: auditStatus },
      )
      return new ResponseResult(
        ResultCode.success,
        null,
        `已${auditStatus === IAudit.agree ? '通过' : '拒绝'}`,
      )
    })
  }

  /** 完善商铺用户 */
  async completeStoreUser(dto: CompleteStoreUserDto, userId) {
    const { storeName, logo, license, province, city, name, idCard } = dto

    return await myTryCatch(async () => {
      await this.storeModel.findOneAndUpdate({ userId }, {
        storeName,
        logo,
        license,
        province,
        city,
        name,
        idCard,
        audit: IAudit.await,
      })

      return new ResponseResult(
        ResultCode.success,
        null,
        '完善商铺用信息成功，请等待审核',
      )
    })
  }
}
