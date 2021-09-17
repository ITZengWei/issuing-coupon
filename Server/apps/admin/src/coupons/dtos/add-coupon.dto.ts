import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'


export class AddCouponDto {
  @ApiProperty({ description: '优惠券名称', example: '优惠券名称' })
  @IsNotEmpty({ message: '优惠券名称不能为空' })
  readonly couponName: string

  @ApiProperty({ description: '优惠卷额度', example: '优惠卷额度' })
  @IsNotEmpty({ message: '优惠卷额度不能为空' })
  @Type(val => Number)
  readonly subMoney: number

  @ApiProperty({ description: '最低消费', example: '最低消费' })
  @IsNotEmpty({ message: '最低消费不能为空' })
  @Type(val => Number)
  readonly minCharge: number

  @ApiProperty({ description: '有效时长(-1: 永久，单位天)', example: '有效时长(-1: 永久，单位天)' })
  @IsNotEmpty({ message: '有效时长不能为空' })
  @Type(val => Number)
  readonly effectiveDay: number
}