import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CompleteStoreUserDto {
  @ApiProperty({ description: '商铺名称', example: '商铺名称' })
  @IsNotEmpty({ message: '商铺名称不能为空' })
  readonly storeName: string

  @ApiProperty({ description: '商铺LOGO', example: '商铺LOGO' })
  @IsNotEmpty({ message: '商铺LOGO不能为空' })
  readonly logo: string

  @ApiProperty({ description: '商铺营业执照', example: '商铺营业执照' })
  @IsNotEmpty({ message: '商铺营业执照不能为空' })
  readonly license: string

  @ApiProperty({ description: '商铺所在省', example: '商铺所在省' })
  @IsNotEmpty({ message: '商铺所在省不能为空' })
  readonly province: string

  @ApiProperty({ description: '商铺所在市', example: '商铺所在市' })
  @IsNotEmpty({ message: '商铺所在市不能为空' })
  readonly city: string

  @ApiProperty({ description: '姓名', example: '姓名' })
  @IsNotEmpty({ message: '姓名不能为空' })
  readonly name: string

  @ApiProperty({ description: '身份证', example: '身份证' })
  @IsNotEmpty({ message: '身份证不能为空' })
  readonly idCard: number

  //
  // @ApiProperty({ description: '商铺电话', example: '商铺电话' })
  // @IsNotEmpty({ message: '商铺电话不能为空' })
  // readonly shopPhone: number
}