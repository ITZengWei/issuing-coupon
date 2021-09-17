import { Controller, Post, Get, UseGuards, Body } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { UserDocumentType, UserModel } from 'libs/db/models/user.model'
import { RegisterDto } from './dtos/register.dto'
import { LoginDto } from './dtos/login.dto'
import { AuthService } from './auth.service'
import { CurrentUser } from '@app/common/ParamDecorators/user.decorator'
import { CreateAdminDto } from './dtos/create-admin.dto'
import { AuthAdminDto } from './dtos/auth-admin.dto'
import { ResponseResult } from '@app/common/Results/response.result'

@ApiTags('用户相关接口')
@Controller('')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  /* 登录 */
  @Post('login')
  @UseGuards(AuthGuard('admin_local'))
  @ApiOperation({ summary: '用户登录' })
  async login(
    @CurrentUser('') user: UserDocumentType,
    @Body() loginDto: LoginDto,
  ): Promise<ResponseResult<any>> {
    return await this.AuthService.login(user)
  }

  /* 注册 */
  // @Post('register')
  // @ApiOperation({ summary: '用户注册' })
  // async register(@Body() registerDto: RegisterDto) {
  //   return await this.AuthService.register(registerDto)
  // }

  /* 获取用户信息 */
  @Get('getUserInfo')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  @UseGuards(AuthGuard('admin_jwt'))
  async userInfo(
    @CurrentUser('') user: UserDocumentType,
  ): Promise<ResponseResult<UserModel>> {
    return await this.AuthService.userInfo(user)
  }
}
