import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsArray, IsString, IsNumber, Max, Min } from 'class-validator'
import {IUserType} from "libs/db/models/menu.model";



export class FindAsideMenuDto {
  @ApiProperty({ description: '用户类型', example: '2' })
  @IsNotEmpty({ message: '用户类型不能为空', context: { errorCode:  1 } })
  userType: IUserType
}