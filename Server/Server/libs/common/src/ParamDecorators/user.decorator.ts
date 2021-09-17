import { createParamDecorator, BadRequestException } from '@nestjs/common'
import { IUserType } from 'libs/db/models/user.model'

/** TODO 解决多个角色的问题 */

export const CurrentUser = createParamDecorator(
  (data: 'system' | 'coupon' | 'store' | 'auth' | '', res) => {
    let userType = res.user.type as IUserType

    if (data === 'system' && userType !== IUserType.systemAdmin) {
      throw new BadRequestException('用户类型不符合系统管理员')
    } else if (data === 'coupon' && userType !== IUserType.couponAdmin) {
      throw new BadRequestException('用户类型不符合优惠卷管理员')
    } else if (data === 'store' && userType !== IUserType.company) {
      throw new BadRequestException('用户类型不符合商家')
    } else if (
      data === 'auth' &&
      ![
        IUserType.systemAdmin,
        IUserType.couponAdmin,
        IUserType.company,
      ].includes(userType)
    ) {
      throw new BadRequestException('游客暂无权限')
    }

    return res.user
  },
)
