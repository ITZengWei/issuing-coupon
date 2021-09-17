import { prop, modelOptions } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { UserModel } from 'libs/db/models/user.model'

export enum IAudit {
  /** 审核拒绝 */
  reject = -1,

  /** 等待审核 */
  await = 0,

  /** 审核通过 */
  agree = 1,
}

/** 默认商铺成员数据 */
export const defaultStoreData = {
  storeName: '',
  name: '',
  idCard: '',
  audit: IAudit.await,
  isFreeze: false,
  logo: '',
  license: '',
  province: '',
  city: '',
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class StoreModel {
  @prop({
    ref: 'UserModel',
  })
  @ApiProperty({ title: '用户ID', example: '5' })
  userId: UserModel

  @prop()
  @ApiProperty({ description: '商铺店主真实姓名', example: '' })
  name: string

  @prop()
  @ApiProperty({ description: '商铺店主身份证', example: '' })
  idCard: number

  @prop()
  @ApiProperty({ description: '商铺名称', example: '鱼香肉丝' })
  storeName: string

  @prop()
  @ApiProperty({ description: '商铺LOGO', example: '' })
  logo: string

  @prop()
  @ApiProperty({ description: '商铺营业执照', example: '' })
  license: string

  @prop()
  @ApiProperty({ description: '商铺所在省', example: '江西省' })
  province: string

  @prop()
  @ApiProperty({ description: '商铺所在市', example: '南昌市' })
  city: string

  @prop()
  @ApiProperty({
    description: '审核状态 -1 审核不通过 0 审核中 1 审核通过',
    example: '0',
  })
  audit: number

  @prop()
  @ApiProperty({ title: '优惠券当前是否为冻结状态', example: false })
  isFreeze: boolean
}
