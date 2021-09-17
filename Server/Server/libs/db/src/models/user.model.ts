import { prop, modelOptions, DocumentType } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { hashSync } from 'bcryptjs'
import { IAudit } from 'libs/db/models/store.model';

export type UserDocumentType = DocumentType<UserModel>

export enum IUserType {
  /** 普通用户 */
  common = 1,

  /** 商户 */
  company = 2,

  /** 优惠卷管理员 */
  couponAdmin = 3,

  /** 系统管理员 */
  systemAdmin = 4,
}

export enum IUserGender {
  /** 保密 */
  secret = -1,

  /** 男 */
  man = 1,

  /** 女 */
  woman = 0,
}

/** 默认用户成员数据 */
export const defaultStoreData = {
  gender: IUserGender.secret,
  nickname: '',
  avatar: '',
}

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class UserModel {
  @prop()
  @ApiProperty({ description: '账号', example: 'Bill' })
  account: string

  @prop()
  @ApiProperty({ description: '手机号码', example: '13407943933' })
  tel: string

  @prop({
    select: false,
    get: (val) => val,
    set: (val) => val ? hashSync(val, 12) : val
  })
  @ApiProperty({ description: '密码', example: '110349' })
  psw: string

  @prop()
  @ApiProperty({ description: '用户类型 1 普通 2 商户 3 优惠卷管理员 4 系统管理员', example: 1 })
  type: number

  @prop()
  @ApiProperty({ description: '性别 -1 保密 0 女 1 男', example: '-1' })
  gender: number

  @prop()
  @ApiProperty({ description: '昵称', example: '陌琼' })
  nickname: string

  @prop()
  @ApiProperty({ description: '头像', example: '头像' })
  avatar: string
}