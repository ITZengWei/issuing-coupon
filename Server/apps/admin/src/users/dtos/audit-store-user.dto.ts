import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class AuditStoreUserDto {
  @ApiProperty({ description: '商户ID', example: '商户ID' })
  @IsNotEmpty({ message: '商户ID不能为空' })
  readonly userId: string

  @ApiProperty({ description: '审核状态', example: '审核状态' })
  @IsNotEmpty({ message: '审核状态不能为空' })
  @Type(val => Number)
  readonly auditStatus: number
}