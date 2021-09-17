import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer';


export class ChangeBaseInfoDto {
  @ApiProperty({ description: '用户ID', example: '用户ID' })
  @IsNotEmpty({ message: '用户ID不能为空' })
  readonly userId: string

  @ApiProperty({ description: '昵称', example: '昵称' })
  readonly nickname: string

  @ApiProperty({ description: '性别', example: '-1 保密 0 女 1 ' })
  @Type(val => Number)
  readonly gender: number
}