import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'


export class AddChargeDto {
  @ApiProperty({ description: '领取优惠券的Id', example: '领取优惠券的Id' })
  @IsNotEmpty({ message: '领取优惠券的Id不能为空' })
  readonly receiveCoupon: string
}