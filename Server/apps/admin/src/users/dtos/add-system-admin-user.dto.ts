import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class AddSystemAdminUserDto {
  @ApiProperty({ description: '账号', example: '账号' })
  @IsNotEmpty({ message: '账号不能为空' })
  readonly account: string

  @ApiProperty({ description: '密码', example: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string


  @ApiProperty({ description: '手机号', example: '手机号' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @Type(val => Number)
  readonly tel: number
}