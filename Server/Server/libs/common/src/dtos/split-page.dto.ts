import { IsNotEmpty, IsString, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class SplitPageDto {

  @ApiProperty({ description: '当前页', example: 1 })
  @IsNotEmpty({ message: '当前页不能为空', context: { errorCode:  1 } })
  @Type((val) => Number)
  readonly pageNum: number

  @ApiProperty({ description: '分页数量', example: 6 })
  @Type((val) => Number)
  readonly pageSize: number
}