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
import { CouponsService } from './coupons.service'
import { CurrentUser } from '@app/common/ParamDecorators/user.decorator'
import { AddCouponDto } from './dtos/add-coupon.dto'
import { AuditStoreCouponDto } from './dtos/audit-store-coupon.dto'
import { PublishCouponDto } from './dtos/publish-coupon.dto'
import { UpdateCouponDto } from './dtos/update-coupon.dto'
import { ReceiveCouponDto } from './dtos/receive-coupon.dto'
import { SplitPageDto } from '@app/common/dtos/split-page.dto'
import { AddChargeDto } from './dtos/add-charge.dto';

@ApiTags('优惠卷相关接口')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly CouponsService: CouponsService) {}

  @Post('/addCoupon')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '添加优惠卷' })
  async addCoupon(
    @Body() dto: AddCouponDto,
    @CurrentUser('') user: UserDocumentType,
  ) {
    return await this.CouponsService.addCoupon(dto, user)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '删除优惠卷' })
  async removeCoupon(@Param('id') id: string) {
    return await this.CouponsService.removeCoupon(id)
  }

  @Patch('/updateCoupon')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '修改优惠卷' })
  async updateCoupon(
    @Body() dto: UpdateCouponDto,
    @CurrentUser('') user: UserDocumentType,
  ) {
    return await this.CouponsService.updateCoupon(dto, user)
  }

  @Patch('/auditCoupon')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '审核管理员审核优惠卷' })
  async auditCoupon(
    @Body() dto: AuditStoreCouponDto,
    @CurrentUser('coupon') user: UserDocumentType,
  ) {
    return await this.CouponsService.auditCoupon(dto)
  }

  @Patch('/publishCoupon')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '投放优惠卷' })
  async publishCoupon(@Body() dto: PublishCouponDto) {
    return await this.CouponsService.publishCoupon(dto)
  }

  @Get('findCoupons')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '获取所属优惠卷' })
  async findCoupons(@CurrentUser('') user: UserDocumentType) {
    return await this.CouponsService.findCoupons(user)
  }

  @Get('findAuthCoupons')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '获取所属已认证优惠卷' })
  async findAuthCoupons(@CurrentUser('') user: UserDocumentType) {
    return await this.CouponsService.findAuthCoupons(user)
  }

  @Get('findAllCoupons')
  @ApiOperation({ summary: '前台获取所有的优惠卷' })
  async findAllCoupons() {
    return await this.CouponsService.findAllCoupons()
  }

  @Get('/findAllCouponsByUser/:id')
  @ApiOperation({ summary: '前台用户获取自己领取的优惠卷' })
  async findAllCouponsByUser(@Param('id') id: string) {
    return await this.CouponsService.findAllCouponsByUser(id)
  }

  @Post('/findUsedCoupons')
  @ApiOperation({ summary: '后台优惠卷管理员获取使用的优惠卷明细' })
  async findUsedCoupons(@Body() dto: SplitPageDto) {
    return await this.CouponsService.findUsedCoupons(dto)
  }

  @Post('receiveCoupons')
  @ApiOperation({ summary: '前台用户领取优惠卷' })
  async receiveCoupon(@Body() dto: ReceiveCouponDto) {
    return await this.CouponsService.receiveCoupon(dto)
  }

  @Get('/getChargeCouponDetail/:id')
  @ApiOperation({ summary: '查询需要核销优惠券明细' })
  async getChargeCouponDetail(@Param('id') id: string) {
    return await this.CouponsService.getChargeCouponDetail(id)
  }

  @Get('/checkCharge/:id')
  @ApiOperation({ summary: '前台检查是否核销' })
  async checkHasCharge(@Param('id') id: string) {
    return await this.CouponsService.checkHasCharge(id)
  }

  @Post('/addCharge')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin_jwt'))
  @ApiOperation({ summary: '添加核销' })
  async addCharge(@Body() dto: AddChargeDto, @CurrentUser('') user: UserDocumentType) {
    /** TODO user.id => store.id */
    return await this.CouponsService.addCharge(dto, user._id)
  }

  @Get('/useCoupon/:id')
  @ApiOperation({ summary: '前台使用优惠卷' })
  async useCoupon(@Param('id') id: string) {
    return await this.CouponsService.useCoupon(id)
  }

  @Get('/cleanReceiveCoupon/:id')
  @ApiOperation({ summary: '清除已使用优惠卷' })
  async cleanReceiveCoupon(@Param('id') id: string) {
    return await this.CouponsService.cleanReceiveCoupon(id)
  }

  @Delete('/removeReceiveCoupon/:id')
  @ApiOperation({ summary: '删除已使用优惠卷' })
  async removeReceiveCoupon(@Param('id') id: string) {
    return await this.CouponsService.removeReceiveCoupon(id)
  }
}
