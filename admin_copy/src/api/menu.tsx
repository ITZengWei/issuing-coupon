import { IAsideMenu } from '../components/container/container-aside'
import request from '../utils/request'
import {
  DashboardOutlined,
  UserOutlined,
  DollarCircleOutlined,
  QrcodeOutlined,
  ClusterOutlined,
} from '@ant-design/icons'
import { IUserType } from '../store/module/user/reducer'

export interface IMockMenuData {
  /** 公共菜单 */
  common: IAsideMenu[]

  /** 预备商家 添加商家，但是没有完善信息 */
  readyCompany: IAsideMenu[]

  /** 商家 */
  company: IAsideMenu[]

  /** 优惠券管理员 */
  couponAdmin: IAsideMenu[]

  /** 系统管理员 */
  systemAdmin: IAsideMenu[]
}

const mockMenuData: IMockMenuData = {
  common: [
    {
      topIds: [],
      auth: [IUserType.common],
      _id: '60238704ed72282ea0a24c44',
      title: '仪表盘',
      path: '/dashboard',
      icon: <DashboardOutlined />,
      index: 100,
    },
    {
      topIds: ['60238704ed72282ea0a24c44'],
      auth: [IUserType.common],
      _id: '60238729ed72282ea0a24c45',
      title: '分析页',
      path: '/analyses',
      parentId: '60238704ed72282ea0a24c44',
    },
    {
      topIds: [],
      auth: [IUserType.common],
      _id: '60238970ed72282ea0a24c51',
      title: '用户页',
      path: '/account',
      icon: <UserOutlined />,
    },
    {
      topIds: ['60238970ed72282ea0a24c51'],
      auth: [IUserType.common],
      _id: '602389bbed72282ea0a24c53',
      title: '个人中心',
      path: '/center',
      icon: '',
      parentId: '60238970ed72282ea0a24c51',
    },
    {
      topIds: ['60238970ed72282ea0a24c51'],
      auth: [IUserType.common],
      _id: '602389d1ed72282ea0a24c54',
      title: '个人设置',
      path: '/setting',
      icon: '',
      parentId: '60238970ed72282ea0a24c51',
    },
  ],
  readyCompany: [
    {
      topIds: ['60238970ed72282ea0a24c51'],
      auth: [IUserType.readyCompany, IUserType.company],
      _id: '602389bbed72282ea0a24c54',
      title: '店铺信息',
      path: '/store',
      icon: '',
      parentId: '60238970ed72282ea0a24c51',
    },
  ],
  company: [
    {
      topIds: ['60238970ed72282ea0a24c51'],
      auth: [IUserType.readyCompany, IUserType.company],
      _id: '602389bbed72282ea0a24c55',
      title: '店铺信息',
      path: '/store',
      icon: '',
      parentId: '60238970ed72282ea0a24c51',
    },
    {
      topIds: [],
      auth: [IUserType.company],
      _id: '602389bbed72282ea0a24c56',
      title: '优惠券管理',
      path: '/coupon',
      icon: <DollarCircleOutlined />,
    },
    {
      topIds: [],
      auth: [IUserType.company],
      _id: '6023892bed72282ea0a24c56',
      title: '活动管理',
      path: '/activeManage',
      icon: <ClusterOutlined />,
    },
    {
      topIds: ['602389bbed72282ea0a24c56'],
      auth: [IUserType.company, IUserType.couponAdmin],
      _id: '602389bbe82ea0a24c56',
      title: '优惠券列表',
      path: '/store',
      icon: '',
      parentId: '602389bbed72282ea0a24c56',
    },
    {
      topIds: ['602389bbed72282ea0a24c56'],
      auth: [IUserType.couponAdmin, IUserType.company],
      _id: '602389bb72282ea0a24c56',
      title: '发放商家优惠券',
      path: '/publish',
      icon: '',
      parentId: '602389bbed72282ea0a24c56',
    },
  ],
  couponAdmin: [
    {
      topIds: ['602389bbed72282ea0a24c56'],
      auth: [IUserType.company, IUserType.couponAdmin],
      _id: '602389bbe82ea0a24c56',
      title: '优惠券列表',
      path: '/store',
      icon: '',
      parentId: '602389bbed72282ea0a24c56',
    },
    {
      topIds: [],
      auth: [IUserType.company, IUserType.couponAdmin],
      _id: '602389bbed72282ea0a24c56',
      title: '优惠券管理',
      path: '/coupon',
      icon: <DollarCircleOutlined />,
    },

    {
      topIds: ['602389bbed72282ea0a24c56'],
      auth: [IUserType.couponAdmin, IUserType.company],
      _id: '602389bb72282ea0a24c56',
      title: '发放平台优惠券',
      path: '/publish',
      icon: '',
      parentId: '602389bbed72282ea0a24c56',
    },
    {
      topIds: ['602389bbed72282ea0a24c56'],
      auth: [IUserType.company, IUserType.couponAdmin],
      _id: '602389bbe82ea0a24vv6',
      title: '已使用优惠券',
      path: '/used',
      icon: '',
      parentId: '602389bbed72282ea0a24c56',
    },
  ],
  systemAdmin: [
    {
      topIds: [],
      auth: [IUserType.systemAdmin],
      _id: '602387bfed72282ea0a24c47',
      title: '菜单管理',
      path: '/menu',
      icon: <QrcodeOutlined />,
    },
    {
      topIds: ['602387bfed72282ea0a24c47'],
      auth: [IUserType.systemAdmin],
      _id: '602387e6ed72282ea0a24c49',
      title: '菜单树',
      path: '/tree',
      parentId: '602387bfed72282ea0a24c47',
    },
    {
      topIds: ['60238970ed72282ea0a24c51'],
      auth: [IUserType.systemAdmin],
      _id: '602389bbed72282ea0a24c54',
      title: '人员管理',
      path: '/list',
      icon: '',
      parentId: '60238970ed72282ea0a24c51',
    },
  ],
}

/** 获取侧边栏菜单 */
export function fetchAsideMenus<T = any>(
  userType: 'company' | 'readyCompany' | 'couponAdmin' | 'systemAdmin',
) {
  const userMenus = mockMenuData[userType]

  return Promise.resolve(mockMenuData.common.concat(userMenus))
}

/** 获取三种不同的菜单树 (基础、普通、管理员) */
export function fetchMenuTree<T = any>(): T {
  return Promise.resolve(mockMenuData) as any
}
