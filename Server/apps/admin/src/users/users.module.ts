import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { LocalStrategy } from '../auth/strategys/local.strategy';

@Module({
  providers: [UsersService, LocalStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
