import { IUserType, IUserInfo, IAudit } from '../store/module/user/reducer'

export enum RealUserType {
  common = 1,
  store = 2,
  coupon = 3,
  system = 4,
}

/** 获取用户类型 */
export function getUserType(user: IUserInfo): IUserType {
  const { store, type } = user

  const realType = type as any

  // audit
  if (realType === RealUserType.store) {
    const audit = store!.audit
    return audit === IAudit.agree
      ? IUserType.company
      : IUserType.readyCompany
  }

  if (realType === RealUserType.coupon) {
    return IUserType.couponAdmin
  }

  if (realType === RealUserType.system) {
    return IUserType.systemAdmin
  }

  return IUserType.common
}
