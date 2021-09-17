import { IsNotEmpty, IsString, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ChangeLevelDto {

  @ApiProperty({ description: '用户ID', example: '用户ID' })
  @IsNotEmpty({ message: '用户ID不能为空', context: { errorCode:  1 } })
  readonly userId: string

  @ApiProperty({ title: '用户等级', example: '用户等级  0 普通 1 管理员 2 超级管理员' })
  @IsNotEmpty({ message: '用户等级不能为空', context: { errorCode:  1 } })
  level: string
}