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

  @prop()
  @ApiProperty({ title: '是否使用', example: false })
  used: boolean

  @prop()
  @ApiProperty({ title: '清除标识', example: false })
  cleanFlag: boolean
}