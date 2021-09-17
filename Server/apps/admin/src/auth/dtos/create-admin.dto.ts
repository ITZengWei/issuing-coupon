import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEmpty } from 'class-validator'


export const CreateArticleDescription = `
  account: 用户名 或 手机号
  
  psw: 密码
`

export class CreateAdminDto {

  @ApiProperty({ title: '用户ID', example: '用户ID' })
  @IsNotEmpty({ message: '用户ID不能为空', context: { errorCode: -1 } })
  userId: string

  // @ApiProperty({ title: '与开发者的关系', example: '与开发者的关系' })
  // @IsNotEmpty({ message: '与开发者的关系不能为空', context: { errorCode: -1 } })
  // relation: string
}