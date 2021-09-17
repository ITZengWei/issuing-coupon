import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class PublishCouponDto {
  @ApiProperty({ description: '优惠卷', example: '优惠卷' })
  @IsNotEmpty({ message: '优惠卷不能为空' })
  readonly couponId: string

  @ApiProperty({ description: '投放优惠卷数额', example: '投放优惠卷数额' })
  @IsNotEmpty({ message: '投放优惠卷数额不能为空' })
  @Type(val => Number)
  readonly count: number
}