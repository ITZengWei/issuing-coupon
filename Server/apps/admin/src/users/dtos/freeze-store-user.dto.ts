import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FreezeStoreUserDto {
  @ApiProperty({ description: '商户ID', example: '商户ID' })
  @IsNotEmpty({ message: '商户ID不能为空' })
  readonly userId: string

  @ApiProperty({ description: '审核状态', example: '审核状态' })
  @IsNotEmpty({ message: '审核状态不能为空' })
  readonly isFreeze: boolean
}