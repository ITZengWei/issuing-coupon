import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { UserDocumentType } from 'libs/db/models/user.model'
import { UsersService } from './users.service'
import { CurrentUser } from '@app/common/ParamDecorators/user.decorator'
import { CompleteStoreUserDto } from './dtos/complete-store-user.dto'
import { AddCouponAdminUserDto } from './dtos/add-coupon-admin-user.dto'
import { AddStoreUserDto } from './dtos/add-store-user.dto'
import { AddSystemAdminUserDto } from './dtos/add-system-admin-user.dto'
import { AuditStoreUserDto } from './dtos/audit-store-user.dto'
import { FreezeStoreUserDto } from './dtos/freeze-store-user.dto';
import { AddCommonUserDto } from './dtos/add-common-user.dto';
import { ChangeBaseInfoDto } from './dtos/change-base-info.dto';

@ApiTags('用户相关接口')
@Controller('users')
export class UsersController {
  constructor(
    private readonly UsersService: UsersService,
  ) {}

  @Get('findAll')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '系统管理员获取用户列表' })
  async findAllUser(@CurrentUser('system') user: UserDocumentType) {
    return await this.UsersService.findAllUser()
  }

  @Post('/addStoreUser')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '添加商铺用户' })
  async addStoreUser(
    @Body() dto: AddStoreUserDto,
    @CurrentUser('system') user: UserDocumentType,
  ) {
    return await this.UsersService.addStoreUser(dto)
  }

  @Post('/addCommonUser')
  @ApiOperation({ summary: '添加普通用户' })
  async addCommonUser(
    @Body() dto: AddCommonUserDto,
  ) {
    return await this.UsersService.addCommonUser(dto)
  }

  @Post('/addSystemAdminUser')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '添加系统管理员用户' })
  async addSystemAdminUser(
    @Body() dto: AddSystemAdminUserDto,
    // @CurrentUser('system') user: UserDocumentType,
  ) {
    return await this.UsersService.addSystemAdminUser(dto)
  }

  @Post('/addCouponAdminUser')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '添加优惠卷管理员用户' })
  async addCouponAdminUser(
    @Body() dto: AddCouponAdminUserDto,
    @CurrentUser('system') user: UserDocumentType,
  ) {
    return await this.UsersService.addCouponAdminUser(dto)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '删除用户' })
  async remove(
    @Param('id') id: string,
    @CurrentUser('system') user: UserDocumentType,
  ) {
    return await this.UsersService.remove(id)
  }

  @Patch('/changeBaseInfo')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '修改用户基础信息' })
  async changeUserBaseInfo(@Body() dto: ChangeBaseInfoDto) {
    return await this.UsersService.changeUserBaseInfo(dto)
  }

  @Patch('/freezeStoreUser')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '冻结商铺用户' })
  async freezeStoreUser(@Body() dto: FreezeStoreUserDto) {
    return await this.UsersService.freezeStoreUser(dto)
  }

  @Patch('/auditStoreUser')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '审核商户' })
  async auditStoreUser(
    @Body() dto: AuditStoreUserDto,
    @CurrentUser('system') user: UserDocumentType,
  ) {
    return await this.UsersService.auditStoreUser(dto)
  }

  @Patch('/completeStoreUser')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '完善商铺用户' })
  async completeStoreUser(
    @Body() dto: CompleteStoreUserDto,
    @CurrentUser() user: UserDocumentType,
  ) {
    return await this.UsersService.completeStoreUser(dto, user._id)
  }
}
