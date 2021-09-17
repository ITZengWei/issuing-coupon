import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {CommonModule} from "@app/common";
import { MulterModule } from '@nestjs/platform-express'; // 文件操作
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import {AuthModule} from "./auth/auth.module";
import { MenusModule } from './menus/menus.module';
import { AnalysesModule } from './analyses/analyses.module';
import { CouponsModule } from './coupons/coupons.module';


@Module({
  imports: [
    CommonModule,
    UsersModule,
    FilesModule,
    AuthModule,
    MenusModule,
    AnalysesModule,
    CouponsModule,
  ],
  controllers: [

  ],
  providers: [AppService],
})
export class AppModule {}
