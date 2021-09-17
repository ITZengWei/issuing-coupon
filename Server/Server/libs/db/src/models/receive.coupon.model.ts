import { prop, modelOptions } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'

@modelOptions({
  schemaOptions: {
    timestamps: true,
  }
})
export class ReceiveCouponModel {
  @prop({
    ref: 'UserModel'
  })
  @ApiProperty({ title: '用户ID', example: '5' })
  userId: string

  @prop({
    ref: 'CouponModel'
  })
  @ApiProperty({ title: '优惠卷Id', example: '5' })
  couponId: string
}