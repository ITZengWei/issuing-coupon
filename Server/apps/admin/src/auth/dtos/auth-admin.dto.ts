import { IsNotEmpty, IsString, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AuthAdminDto {

  @ApiProperty({ description: '用户ID', example: '用户ID' })
  @IsNotEmpty({ message: '用户ID不能为空', context: { errorCode:  1 } })
  readonly userId: string

  @ApiProperty({ title: '审核状态', example: '审核状态 -1 审核不通过 0 审核中 1 审核通过' })
  @IsNotEmpty({ message: '审核状态不能为空', context: { errorCode:  1 } })
  status: string
}