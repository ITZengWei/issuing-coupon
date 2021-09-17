import { prop, modelOptions, arrayProp } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'

export enum IUserType {
  /** 普通用户 */
  common = '0',

  /** 初级管理员 */
  admin = '1',

  /** 超级管理员 */
  superAdmin = '2',
}

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class MenuModel {
  @prop()
  @ApiProperty({ title: '菜单标题', example: '仪表盘' })
  title: string

  @prop()
  @ApiProperty({ title: '菜单路径', example: '/dashboard' })
  path: string

  @prop()
  @ApiProperty({ title: '菜单图标', example: '暂且用antd图标' })
  icon: string

  @prop()
  @ApiProperty({ title: '菜单索引', example: 100, description: 'index 索引 id 为 4 位数 xxxx 前两位是一级菜单索引，后两位是 二、三级菜单索引' })
  index: number

  @prop({
    ref: 'MenuModel'
  })
  @ApiProperty({title: '父级菜单id', example: null})
  parentId: string

  @arrayProp({ ref: 'MenuModel' })
  @ApiProperty({title: '上级菜单 id(为一个数组)', example: ['xxx', 'xxx']})
  topIds: Array<string>

  @prop({})
  @ApiProperty({title: '用户菜单权限', example: ['xxx', 'xxx']})
  auth: Array<IUserType>
}