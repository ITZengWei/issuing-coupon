import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'


export class ReceiveCouponDto {
  @ApiProperty({ description: '优惠券Id', example: '优惠券Id' })
  @IsNotEmpty({ message: '优惠券Id不能为空' })
  readonly couponId: string

  @ApiProperty({ description: '用户Id', example: '用户Id' })
  @IsNotEmpty({ message: '用户Id不能为空' })
  readonly userId: string
}