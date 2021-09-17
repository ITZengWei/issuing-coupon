import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsArray, IsString, IsNumber, Max, Min } from 'class-validator'
import {IUserType} from "libs/db/models/menu.model";
import { Type } from 'class-transformer'



export class CreateMenuDto {

  @ApiProperty({ title: '菜单标题', example: '' })
  @IsNotEmpty({ message: '菜单标题不能为空', context: { errorCode: -1 } })
  title: string

  @ApiProperty({ title: '菜单路径', example: '' })
  @IsNotEmpty({ message: '菜单路径不能为空', context: { errorCode: -1 } })
  path: string

  @ApiProperty({ title: '菜单图标', example: '' })
  icon: string

  @ApiProperty({ title: '菜单索引', example: 100 })
  @IsNotEmpty({ message: '菜单索引不能为空', context: { errorCode: -1 } })
  @IsNumber()
  @Max(9999)
  @Min(100)
  index: number

  @ApiProperty({ title: '父级 Id(不存在为 null)', example: undefined })
  parentId: string

  @ApiProperty({ title: '上级菜单 id(为一个数组)', example: [] })
  @IsNotEmpty({ message: '上级菜单不能为空', context: { errorCode: -1 } })
  @IsArray({ message: '上级菜单只能为数组', context: { errorCode: -1 } })
  topIds: string []

  @ApiProperty({ title: '菜单权限', example: [] })
  @IsNotEmpty({ message: '菜单权限不能为空', context: { errorCode: -1 } })
  @IsArray({ message: '菜单权限只能为数组', context: { errorCode: -1 } })
  auth: IUserType []
}