import { prop, modelOptions, arrayProp } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { UserModel } from 'libs/db/models/user.model';
import { IAudit } from 'libs/db/models/store.model';

/** 默认优惠卷成员数据 */
export const defaultCouponData = {
  count: 0,
  isStore: false,
  removeFlag: false,
  audit: IAudit.await
}

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class CouponModel {
  @prop({
    ref: 'UserModel'
  })
  @ApiProperty({ title: '用户ID', example: '5' })
  userId: string

  @prop()
  @ApiProperty({ title: '优惠券名称', example: '满10-2' })
  couponName: string

  @prop()
  @ApiProperty({ title: '优惠券额度', example: 2 })
  subMoney: number

  @prop()
  @ApiProperty({ title: '优惠券额度', example: 10 })
  minCharge: number

  // @prop()
  // @ApiProperty({ title: '有效时长(-1: 永久，单位天)', example: 10 })
  // effectiveDay: number

  @prop()
  @ApiProperty({ title: '优惠券使用开始时间', example: '' })
  startTime: string

  @prop()
  @ApiProperty({ title: '优惠券使用截至时间', example: '' })
  endTime: string

  @prop()
  @ApiProperty({ title: '是否永久', example: false })
  isPermanent: boolean

  @prop()
  @ApiProperty({ title: '优惠券投放数量(张)', example: 10 })
  count: number

  @prop()
  @ApiProperty({ title: '是否为商铺优惠卷', example: true })
  isStore: boolean


  @prop()
  @ApiProperty({ title: '优惠券当前是否为删除状态', example: false })
  removeFlag: boolean

  @prop()
  @ApiProperty({ description: '审核状态 -1 审核不通过 0 审核中 1 审核通过', example: '0' })
  audit: number
}