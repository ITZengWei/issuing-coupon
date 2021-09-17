import { prop, modelOptions, arrayProp } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class CategoryModel {
  @prop()
  @ApiProperty({ title: '分类名称', example: '水果' })
  name: string

  @prop({
    // ref: 'CategoryModel'
  })
  @ApiProperty({ title: '父级分类ID', example: '5' })
  parentCategory: string

  @prop()
  @ApiProperty({ title: '父级以上ID集合', example: '1,2,3,4' })
  grandparentCategory: string

}