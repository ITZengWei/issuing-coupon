import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class AuditStoreCouponDto {
  @ApiProperty({ description: '优惠卷', example: '优惠卷' })
  @IsNotEmpty({ message: '优惠卷不能为空' })
  readonly couponId: string

  @ApiProperty({ description: '审核状态', example: '审核状态' })
  @IsNotEmpty({ message: '审核状态不能为空' })
  @Type(val => Number)
  readonly auditStatus: number
}