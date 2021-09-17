import { Module, Global } from '@nestjs/common'
import { DbService } from './db.service'
import { TypegooseModule } from 'nestjs-typegoose'

import { CategoryModel } from 'libs/db/models/category.model'
import { UserModel } from 'libs/db/models/user.model'
import { ImageModel } from 'libs/db/models/image.model'
import { MenuModel } from 'libs/db/models/menu.model'
import { StoreModel } from 'libs/db/models/store.model'
import { CouponModel } from 'libs/db/models/coupon.model';
import { ReceiveCouponModel } from 'libs/db/models/receive.coupon.model';


// 引用模型
const models = TypegooseModule.forFeature([
  CategoryModel,
  UserModel,
  StoreModel,
  ImageModel,
  MenuModel,
  CouponModel,
  ReceiveCouponModel,
])

@Global()
@Module({
  imports: [
    TypegooseModule.forRootAsync({
      useFactory() {
        let {
          DB: DBHost = 'mongodb://localhost:27017/nest-coupon-project',
        } = process.env
        return {
          // 地址
          uri: DBHost,
          // 参数
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
          useNewUrlParser: true,
        }
      },
    }),
    models,
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {}
