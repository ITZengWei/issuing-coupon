import { prop, modelOptions } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class ChargeModel {
  @prop({
    ref: 'StoreModel'
  })
  @ApiProperty({ title: '核销店铺', example: '5' })
  store: string

  @prop({
    ref: 'CouponModel'
  })
  @ApiProperty({ title: '优惠卷', example: '5' })
  coupon: string

  @prop({
    ref: 'ReceiveCouponModel'
  })
  @ApiProperty({ title: '领取优惠卷ID(用户查找信息)', example: '5' })
  receive: string
}