import { IsNotEmpty, IsNumber, IsArray, Max, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import {CreateMenuDto} from "./create-menu.dto";
import {IUserType} from "libs/db/models/menu.model";

export class UpdateMenuDto   {

  @ApiProperty({ description: '菜单ID', example: '菜单ID' })
  @IsNotEmpty({ message: '菜单ID', context: { errorCode:  1 } })
  readonly id: string

  @ApiProperty({ title: '菜单标题', example: '' })
  title: string

  @ApiProperty({ title: '菜单路径', example: '' })
  path: string

  @ApiProperty({ title: '菜单图标', example: '' })
  icon: string

  @ApiProperty({ title: '菜单索引', example: 100 })
  index: number

  @ApiProperty({ title: '父级 Id(不存在为 null)', example: undefined })
  parentId: string

  @ApiProperty({ title: '上级菜单 id(为一个数组)', example: [] })
  topIds: string []

  @ApiProperty({ title: '菜单权限', example: [] })
  auth: IUserType []

}