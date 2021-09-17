import { StringGradients } from 'antd/lib/progress/progress'
import { IAudit } from '../store/module/user/reducer'
import request from '../utils/request'

/** 优惠券模块请求Url集合 */
export enum CouponUrls {
  findStoreCoupons = '/coupons/findCoupons',
  addStoreCoupon = '/coupons/addCoupon',
  changeStoreCoupon = 'xxx',
  removeStoreCoupon = '/coupons',
  updateStoreCoupon = '/coupons/updateCoupon',
  auditStoreCoupon = '/coupons/auditCoupon',
  publishStoreCoupon = '/coupons/publishCoupon',
  findAuthCoupons = '/coupons/findAuthCoupons',
  findUsedCoupons = '/coupons/findUsedCoupons',
  removeReceiveCoupon = '/coupons/removeReceiveCoupon',
  findReceiveCoupon = '/coupons/getChargeCouponDetail',
  addCharge = '/coupons/addCharge',
}

/** 商家添加自己的优惠券 */
export function addStoreCoupon<T>(coupon: any) {
  return request<T>({
    url: CouponUrls.addStoreCoupon,
    method: 'POST',
    data: coupon,
  })
}

/** 商家修改自己的优惠券 */
export function updateStoreCoupon<T>(coupon: any, id: string) {
  return request<T>({
    url: CouponUrls.updateStoreCoupon,
    method: 'PATCH',
    data: {
      ...coupon,
      couponId: id,
    },
  })
}

/** 删除的优惠券 */
export function removeStoreCoupon<T>(id: string) {
  return request<T>({
    url: `${CouponUrls.removeStoreCoupon}/${id}`,
    method: 'DELETE',
  })
}

/** 商家修改自己的优惠券 */
export function changeStoreCoupon<T>() {
  return request<T>({
    url: CouponUrls.changeStoreCoupon,
    method: 'POST',
  })
}

/** 商家获取自己的优惠券 */
export function findStoreCoupons<T>(searchCoupon: string) {
  return request<T>({
    url: CouponUrls.findStoreCoupons + '?s' + searchCoupon,
    method: 'GET',
  })
}

/** 对商家提出的优惠券进行审核 */
export function auditStoreCoupon<T>(auditStatus: IAudit, couponId: string) {
  return request<T>({
    url: CouponUrls.auditStoreCoupon,
    method: 'PATCH',
    data: {
      auditStatus,
      couponId,
    },
  })
}

/** 发放商家优惠券 */
export function publishStoreCoupon<T>(couponId: string, count: number) {
  return request<T>({
    url: CouponUrls.publishStoreCoupon,
    method: 'PATCH',
    data: {
      couponId,
      count,
    },
  })
}

/** 获取所属已认证优惠券 */
export function findAuthCoupons<T>() {
  return request<T>({
    url: CouponUrls.findAuthCoupons,
    method: 'GET',
  })
}

/** 后台优惠券管理员获取使用的优惠券明细*/
export function findUsedCoupons<T>(page: any) {
  return request<T>({
    url: CouponUrls.findUsedCoupons,
    data: page,
    method: 'POST',
  })
}

/** 删除后台优惠券管理员获取使用的优惠券明细 */
export function removeReceiveCoupon<T>(id: string) {
  return request<T>({
    url: `${CouponUrls.removeReceiveCoupon}/${id}`,
    method: 'DELETE',
  })
}

/** 查询需要核销优惠券明细 */
export function findReceiveCoupon<T>(id: string) {
  return request<T>({
    url: `${CouponUrls.findReceiveCoupon}/${id}`,
    method: 'GET',
  })
}

/** 添加核销 */
export function addCharge<T>(receiveCoupon: string) {
  return request<T>({
    url: CouponUrls.addCharge,
    method: 'POST',
    data: { receiveCoupon },
  })
}
