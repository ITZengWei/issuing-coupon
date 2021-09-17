import { prop, modelOptions, arrayProp } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'

@modelOptions({
  schemaOptions: {
    timestamps: true,
  }
})
export class ImageModel {
  @prop()
  @ApiProperty({ title: '图片地址', example: 'XXX' })
  src: string

  @prop()
  @ApiProperty({ title: '图片类型', example: '1 文章,2 相册, 9 其他' })
  imgType: number

}