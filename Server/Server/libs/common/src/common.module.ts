import { Module, Global } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from "libs/db";
import {BaseValidationPipe} from './pipes/base-validate.pipe'
import { JwtModule } from '@nestjs/jwt'


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DbModule,
    BaseValidationPipe,
    // 注册JWT 包
    JwtModule.registerAsync({
      useFactory() {
        let { SECRET: secret = 'xiaolibingzengweiyongyuanaini' } = process.env

        return {
          secret
        }
      }
    }),
  ],
  providers: [CommonService],
  exports: [CommonService, BaseValidationPipe, JwtModule],
})
export class CommonModule {}
