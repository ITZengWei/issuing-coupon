import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategys/local.strategy' // 引用本地策略
import { AuthService } from './auth.service';
import {AuthController} from "./auth.controller";
import {JwtStrategy} from "./strategys/jwt.strategy";


@Module({
  providers: [LocalStrategy, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
