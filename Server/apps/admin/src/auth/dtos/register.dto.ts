import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export const RegisterDescription = `
  username: 用户名
  
  password: 密码
`

export class RegisterDto {

  @IsNotEmpty({ message: '登录账户', context: { errorCode: -1 } })
  @ApiProperty({ title: '用户名', example: 'username' })
  account: string

  @IsNotEmpty({ message: '登录手机号不能为空', context: { errorCode: -1 } })
  @ApiProperty({ title: '手机号', example: '13407943933' })
  tel: string

  @IsNotEmpty({ message: '密码不能为空', context: { errorCode: -1 } })
  @ApiProperty({ title: '密码', example: 'password' })
  psw: string

  @IsNotEmpty({ message: '验证码不能为空', context: { errorCode: -1 } })
  @ApiProperty({ title: '验证码', example: 'code' })
  code: string

}