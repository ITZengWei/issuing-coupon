import { IAudit } from './../store/module/user/reducer'
import request from '../utils/request'

/** 用户模块请求Url集合 */
export enum UserUrls {
  loginRequest = '/login',
  fetchUserInfo = '/getUserInfo',
  auditStoreUser = '/users/auditStoreUser',
  freezeStoreUser = '/users/freezeStoreUser',
  completeStoreUser = '/users/completeStoreUser',

  changeBaseInfo = '/users/changeBaseInfo',

  createCouponAdmin = '/users/addCouponAdminUser',
  createCompany = '/users/addStoreUser',
  createCommon = '/users/addCommonUser',
  fetchUserList = '/users/findAll ',

  changeLevel = '/changeLevel',
  applyAdmin = '/applyAdmin',
  editUser = `/rest/adminUser`,
  removeUser = `/users`,
  registerRequest = '/register',
  authAdmin = '/authAdmin',
}

/**
 * 用户相关接口
 */

/** 用户登录请求 */
export const loginRequest = <T = any>(payload: LoginParams) => {
  const sendParams = {
    account: payload.account,
    psw: payload.password,
  }
  return request<T>({
    url: UserUrls.loginRequest,
    method: 'POST',
    data: sendParams,
  })
}

/** 系统管理员获取所有用户列表信息 */
export const fetchUserList = <T = any>() => {
  return request<T>({
    url: UserUrls.fetchUserList,
    method: 'GET',
  })
}

/** 添加用户参数数据 */
interface CreateUserData {
  account: string
  password: string
  tel: string
}

/** 系统管理员添加优惠券管理员 */
export const createCouponAdmin = <T = any>(user: CreateUserData) => {
  return request<T>({
    url: UserUrls.createCouponAdmin,
    method: 'POST',
    data: user,
  })
}

/** 系统管理员添加商户 */
export const createCompany = <T = any>(user: CreateUserData) => {
  return request<T>({
    url: UserUrls.createCompany,
    method: 'POST',
    data: user,
  })
}

/** 系统管理员添加普通用户 */
export const createCommon = <T = any>(user: CreateUserData) => {
  return request<T>({
    url: UserUrls.createCommon,
    method: 'POST',
    data: user,
  })
}

/** 审核商户状态 */
export const auditStoreUserStatus = <T = any>(
  userId: string,
  auditStatus: IAudit,
) => {
  return request<T>({
    url: UserUrls.auditStoreUser,
    method: 'PATCH',
    data: {
      userId,
      auditStatus,
    },
  })
}

/** 冻结商户 */
export const freezeStoreUser = <T = any>(userId: string, isFreeze: boolean) => {
  return request<T>({
    url: UserUrls.freezeStoreUser,
    method: 'PATCH',
    data: {
      userId,
      isFreeze,
    },
  })
}

/** 完善商户信息接口参数 */
interface CompleteStoreUserParams {
  /** 商户姓名 */
  name: string

  /** 店铺名称 */
  storeName: string

  /** 标志 */
  logo: string

  /** 电话 */
  // phone: string

  /** 营业执照 */
  license: string

  /** 商户所在市 */
  city: string

  /** 商户所在省 */
  province: string

  /** 商户身份证 */
  idCard: string
}

/** 完善商户信息 */
export const completeStoreUser = <T>(storeUser: CompleteStoreUserParams) => {
  return request<T>({
    url: UserUrls.completeStoreUser,
    method: 'patch',
    data: storeUser,
  })
}

/** 更改用户等级 */
export const changeLevel = <T = any>(userId: string, level: string) => {
  const sendParams = { userId, level }

  return request<T>({
    url: UserUrls.changeLevel,
    method: 'POST',
    data: sendParams,
  })
}

/** 申请为管理员 */
export const applyAdmin = <T = any>(userId: string, level: string) => {
  const sendParams = { userId, level }

  return request<T>({
    url: UserUrls.applyAdmin,
    method: 'POST',
    data: sendParams,
  })
}

interface IEditUserData {
  [propName: string]: any
}

/** 编辑用户 */
export const editUser = <T = any>(
  userId: string,
  editUserData: IEditUserData,
) => {
  return request<T>({
    url: `${UserUrls.editUser}/${userId}`,
    method: 'PUT',
    data: editUserData,
  })
}

/* 根据用户ID删除用户 */
export const removeUser = <T = any>(userId: string) => {
  return request<T>({
    url: `${UserUrls.removeUser}/${userId}`,
    method: 'DELETE',
  })
}

/** 登录请求参数集 */
interface LoginParams {
  /** 用户的用户名或者手机号  */
  account: string

  /** 用户密码 */
  password: string
}

/** 注册请求参数集 */
export interface RegisterParams {
  /** 用户名 */
  account: string

  /** 用户密码 */
  psw: string

  /** 手机号 */
  tel: string

  /** 验证码 */
  code: string
}

/** 用户注册请求 */
export const registerRequest = <T = any>(payload: RegisterParams) => {
  return request<T>({
    url: UserUrls.registerRequest,
    method: 'POST',
    data: payload,
  })
}

/** 获取用户信息 */
export const fetchUserInfo = <T = any>() => {
  return request<T>({
    url: UserUrls.fetchUserInfo,
    method: 'GET',
  })
}

/** 添加用户参数数据 */
interface BaseInfoPayload {
  userId: string
  nickname: string
  gender?: -1 | 0 | 1
}

/** 修改用户基础信息 */
export const changeBaseInfo = <T = any>(payload: BaseInfoPayload) => {
  return request<T>({
    url: UserUrls.changeBaseInfo,
    method: 'PATCH',
    data: payload,
  })
}

/** 审核为管理员 */
export const authAdmin = <T = any>(userId: string, status: IAudit) => {
  const sendParams = { userId, status }

  return request<T>({
    url: UserUrls.authAdmin,
    method: 'POST',
    data: sendParams,
  })
}
