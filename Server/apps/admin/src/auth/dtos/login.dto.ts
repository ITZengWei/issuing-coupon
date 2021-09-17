import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class LoginDto {
  @ApiProperty({ title: '用户名/手机号', example: 'admin' })
  @IsNotEmpty({ message: '用户名/手机号不能为空' })
  account: string

  @IsNotEmpty({ message: '密码不能为空' })
  @ApiProperty({ title: '密码', example: 'admin' })
  psw: string
}
