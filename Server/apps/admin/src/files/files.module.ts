import { Module } from '@nestjs/common';
import {FilesService} from "./files.service";
import {FilesController} from "./files.controller";
import { MulterModule } from '@nestjs/platform-express'
const MAO = require('multer-aliyun-oss')

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory() {
        const {
          OSS_REGION: region = 'oss-cn-hangzhou',
          OSS_ACCESS_KEY_ID: accessKeyId = 'LTAI4FqEx3LQANf6jnAHKTSN',
          OSS_ACCESS_KEY_SECRET: accessKeySecret = 'jEKudwA8TLBnPsdGbGVR23922FCrtb',
          OSS_BUCKET: bucket = 'smalllb'
        } = process.env

        return {
          storage: MAO({
            config: {
              region,
              accessKeyId,
              accessKeySecret,
              bucket
            }
          })
        }
      }
    }),
  ],
  providers: [FilesService],
  controllers: [ FilesController ]
})
export class FilesModule {}
