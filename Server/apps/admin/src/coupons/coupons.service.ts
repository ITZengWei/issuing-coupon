import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { ResponseResult } from '@app/common/Results/response.result'
import { myTryCatch } from '@app/common/Utils/tool'
import { ResultCode } from '@app/common/Results/code.result'
import { AddCouponDto } from './dtos/add-coupon.dto'
import {
  IUserType,
  UserDocumentType,
  UserModel,
} from 'libs/db/models/user.model'
import { CouponModel, defaultCouponData } from 'libs/db/models/coupon.model'
import { ReceiveCouponModel } from 'libs/db/models/receive.coupon.model'
import { AuditStoreCouponDto } from './dtos/audit-store-coupon.dto'
import { PublishCouponDto } from './dtos/publish-coupon.dto'
import { IAudit } from 'libs/db/models/store.model'
import * as dayJS from 'dayjs'
import { UpdateCouponDto } from './dtos/update-coupon.dto'
import { ReceiveCouponDto } from './dtos/receive-coupon.dto'
import { SplitPageDto } from '@app/common/dtos/split-page.dto'
import { ChargeModel } from 'libs/db/models/charge.model'
import { AddChargeDto } from './dtos/add-charge.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    @InjectModel(CouponModel)
    private readonly couponModel: ReturnModelType<typeof CouponModel>,
    @InjectModel(ReceiveCouponModel)
    private readonly receiveCouponModel: ReturnModelType<
      typeof ReceiveCouponModel
    >,
    @InjectModel(ChargeModel)
    private readonly chargeModel: ReturnModelType<typeof ChargeModel>,
  ) {}

  /** 添加优惠卷 */
  async addCoupon(dto: AddCouponDto, user: UserDocumentType) {
    const { couponName, subMoney, minCharge, effectiveDay } = dto
    const { type, _id: userId } = user
    /** 如果是优惠卷管理员不需要审核 */
    const audit: IAudit =
      type === IUserType.couponAdmin ? IAudit.agree : IAudit.await

    if (type === IUserType.company) {
      /** 如果是商家，并且审核状态没有通过，不给权限 */
      if ((user as any).store.audit !== IAudit.agree) {
        return new ResponseResult(ResultCode.params, null, `您暂未通过审核`)
      }
    }

    let isPermanent = false

    /** 开始和结束时间 */
    const startTime = dayJS().toString()

    let endTime = startTime

    /** -1 是永久的 */
    if (effectiveDay === -1) {
      isPermanent = true
    } else if (effectiveDay < 0 || Number.isNaN(effectiveDay)) {
      return new ResponseResult(ResultCode.params, null, `请正确填写有效时长`)
    } else {
      /** 设置开始和结束时间 */
      endTime = dayJS(startTime)
        .add(effectiveDay, 'day')
        .toString()
    }

    return await myTryCatch(async () => {
      const newCoupon = {
        ...defaultCouponData,
        isStore: type === IUserType.company,
        userId,
        couponName,
        subMoney,
        minCharge,
        audit,
        isPermanent,
        startTime,
        endTime,
      }
      await this.couponModel.create(newCoupon)

      return new ResponseResult(ResultCode.success, newCoupon, '添加优惠卷成功')
    })
  }

  /** 删除优惠卷 */
  async removeCoupon(id) {
    return await myTryCatch(async () => {
      await this.couponModel.findByIdAndUpdate(id, { removeFlag: true })
      return new ResponseResult(ResultCode.success, null, '删除成功')
    })
  }

  /** 修改优惠卷 */
  async updateCoupon(dto: UpdateCouponDto, user: UserDocumentType) {
    const { couponId, couponName, subMoney, minCharge, effectiveDay } = dto
    const { type } = user
    /** 如果是优惠卷管理员不需要审核 */
    const audit: IAudit =
      type === IUserType.couponAdmin ? IAudit.agree : IAudit.await

    const { count, startTime } = await this.couponModel.findById(couponId)

    if (count > 0) {
      return new ResponseResult(
        ResultCode.other,
        null,
        `投放数大于 0，不能进行修改`,
      )
    }

    let isPermanent = false
    let endTime = startTime

    /** -1 是永久的 */
    if (effectiveDay === -1) {
      isPermanent = true
    } else if (effectiveDay < 0 || Number.isNaN(effectiveDay)) {
      return new ResponseResult(ResultCode.params, null, `请正确填写有效时长`)
    } else {
      /** 设置结束结束时间 */
      endTime = dayJS(startTime)
        .add(effectiveDay, 'day')
        .toString()
    }

    return await myTryCatch(async () => {
      await this.couponModel.findByIdAndUpdate(couponId, {
        couponName,
        subMoney,
        minCharge,
        audit,
        isPermanent,
        endTime,
      })

      return new ResponseResult(ResultCode.success, null, '修改优惠卷成功')
    })
  }

  /** 审核优惠卷 */
  async auditCoupon(dto: AuditStoreCouponDto) {
    const { couponId, auditStatus } = dto

    if (![IAudit.agree, IAudit.reject].includes(auditStatus)) {
      return new ResponseResult(
        ResultCode.params,
        null,
        `请填写正确审核状态(同意: ${IAudit.agree}, 拒绝: ${IAudit.reject})`,
      )
    }

    return await myTryCatch(async () => {
      await this.couponModel.findByIdAndUpdate(couponId, { audit: auditStatus })

      return new ResponseResult(
        ResultCode.success,
        null,
        `已${auditStatus === IAudit.agree ? '通过' : '拒绝'}`,
      )
    })
  }

  /** 投放优惠卷 */
  async publishCoupon(dto: PublishCouponDto) {
    const { couponId, count } = dto

    if (count <= 0 || Number.isNaN(count)) {
      return new ResponseResult(
        ResultCode.params,
        null,
        `请填写正确投放数额 count 必须大于等于 0`,
      )
    }

    return await myTryCatch(async () => {
      const { count: dbCount, audit } = await this.couponModel.findById(
        couponId,
      )

      if (audit !== IAudit.agree) {
        return new ResponseResult(
          ResultCode.params,
          null,
          `优惠卷还未通过审核，请等待`,
        )
      }

      const newCount = dbCount + count
      await this.couponModel.findByIdAndUpdate(couponId, { count: newCount })

      return new ResponseResult(ResultCode.success, newCount, '添加成功')
    })
  }

  /** 获取所属优惠卷 */
  async findCoupons(user: UserDocumentType) {
    const { type, _id: userId } = user

    return await myTryCatch(async () => {
      const vo = {
        couponName: '1',
        subMoney: '1',
        minCharge: '1',
        startTime: '1',
        endTime: '1',
        isPermanent: '1',
        audit: '1',
        isStore: '1',
        count: '1',
        userId: '1',
      }
      let result: any

      /** 优惠卷管理员获取所有的优惠卷 */
      if (type === IUserType.couponAdmin) {
        result = await this.couponModel.find({ removeFlag: false }, vo)
      } else {
        result = await this.couponModel.find(
          { isStore: true, userId, removeFlag: false },
          vo,
        )
      }

      return new ResponseResult(ResultCode.success, result, '获取成功')
    })
  }

  /** 前台获取优惠卷 */
  async findAllCoupons() {
    return myTryCatch(async () => {
      const vo = {
        couponName: '1',
        subMoney: '1',
        minCharge: '1',
        startTime: '1',
        endTime: '1',
        isPermanent: '1',
        isStore: '1',
        count: '1',
      }

      const result = await this.couponModel.find(
        { removeFlag: false, audit: IAudit.agree },
        vo,
      )

      return new ResponseResult(ResultCode.success, result, '获取成功')
    })
  }

  /** 前台获取自己领取优惠卷 */
  async findAllCouponsByUser(userId: string) {
    return myTryCatch(async () => {
      const result = await this.receiveCouponModel
        .find({ userId, cleanFlag: false })
        .populate({
          path: 'couponId',
        })

      return new ResponseResult(ResultCode.success, result, '获取成功')
    })
  }

  /** 后台优惠卷管理员获取使用优惠卷明细 */
  async findUsedCoupons(dto: SplitPageDto) {
    const { pageSize, pageNum } = dto
    const start = (pageNum - 1) * pageSize
    return myTryCatch(async () => {
      const result = await this.receiveCouponModel
        .find({ used: true })
        .populate({
          path: 'couponId',
        })
        .limit(pageSize)
        .skip(start)

      const count = await this.receiveCouponModel
        .find({ used: true })
        .populate({
          path: 'couponId',
        })
        .count()

      return new ResponseResult(
        ResultCode.success,
        { list: result, count },
        '获取成功',
      )
    })
  }

  /** 前台领取优惠卷 */
  async receiveCoupon(dto: ReceiveCouponDto) {
    const { userId, couponId } = dto
    return myTryCatch(async () => {
      await this.receiveCouponModel.create({
        userId,
        couponId,
        used: false,
        cleanFlag: false,
      })

      return new ResponseResult(ResultCode.success, null, '领取成功')
    })
  }

  /** 查询需要核销优惠券明细 */
  async getChargeCouponDetail(receiveCouponId: string) {
    return myTryCatch(async () => {
      const result = await this.receiveCouponModel.findOne({ _id: receiveCouponId, used: false })
        .populate('couponId')

      return new ResponseResult(ResultCode.success, result, '获取成功')
    })
  }

  /** 前台检查是否核销 */
  async checkHasCharge(receiveCouponId: string) {
    return myTryCatch(async () => {
      const result = await this.chargeModel.findOne({ receive: receiveCouponId })
      return new ResponseResult(ResultCode.success, Boolean(result), '获取成功')
    })
  }

  /** 添加核销 */
  async addCharge(dto: AddChargeDto, storeId: string) {
    const { receiveCoupon } = dto

    return myTryCatch(async () => {
      /** 是否核销过 */
      const result = await this.chargeModel.findOne({ receive: receiveCoupon })

      if (result) {
        return new ResponseResult(ResultCode.params, null, '已核销，请勿重复操作。')
      }

      const { couponId } = await this.receiveCouponModel.findById(receiveCoupon)

      await this.chargeModel.create({
        store: storeId,
        coupon: couponId,
        receive: receiveCoupon
      })

      return new ResponseResult(ResultCode.success, null, '添加成功')

      // return new ResponseResult(ResultCode.success, {
      //   store: storeId,
      //   coupon: couponId,
      //   receive: receiveCoupon
      // }, '添加成功')
    })
  }

  /** 前台使用优惠卷 */
  async useCoupon(couponId: string) {
    return myTryCatch(async () => {
      await this.receiveCouponModel.findByIdAndUpdate(couponId, { used: true })
      return new ResponseResult(ResultCode.success, null, '使用成功')
    })
  }

  /** 删除已使用优惠卷 */
  async removeReceiveCoupon(receiveCouponId: any) {
    return myTryCatch(async () => {
      await this.receiveCouponModel.findByIdAndRemove(receiveCouponId)

      return new ResponseResult(ResultCode.success, null, '删除成功')
    })
  }

  /** 清除已使用优惠卷 */
  async cleanReceiveCoupon(receiveCouponId: string) {
    return myTryCatch(async () => {
      await this.receiveCouponModel.findByIdAndUpdate(receiveCouponId, {
        cleanFlag: true,
      })

      return new ResponseResult(ResultCode.success, null, '清除成功')
    })
  }

  /** 获取所属已认证优惠卷 */
  async findAuthCoupons(user: UserDocumentType) {
    const { type, _id: userId } = user

    return await myTryCatch(async () => {
      const vo = {
        couponName: '1',
        subMoney: '1',
        minCharge: '1',
        startTime: '1',
        endTime: '1',
        isPermanent: '1',
        audit: '1',
        count: '1',
      }
      let result: any

      /** 优惠卷管理员获取所有的优惠卷 */
      if (type === IUserType.couponAdmin) {
        result = await this.couponModel.find(
          { removeFlag: false, audit: IAudit.agree, isStore: false },
          vo,
        )
      } else {
        result = await this.couponModel.find(
          { isStore: true, userId, removeFlag: false, audit: IAudit.agree },
          vo,
        )
      }

      return new ResponseResult(ResultCode.success, result, '获取成功')
    })
  }
}
