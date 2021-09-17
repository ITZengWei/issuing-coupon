import {
  FC,
  useState,
  memo,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import { Card, Button, Table, Tag, Popconfirm, message } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import dayJs from 'dayjs'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import { CommonPanel, CommonTableWra } from '../analyses/style'

import { IAudit, IUserInfo, IUserType } from '../../store/module/user/reducer'
import { findAuthCoupons, publishStoreCoupon } from '../../api/coupon'

/** 优惠券字段 */
interface CouponItem {
  _id: string
  audit: IAudit
  couponName: string
  count: number
  subMoney: number
  /** 是否永久有效 */
  isPermanent: boolean
  /** 是否是商户 */
  isStore: boolean
  userId: string
  startTime: string
  endTime: string
}

/** 添加优惠券字段 */
interface AddCouponProps {
  couponName: string
  subMoney: number
  minCharge: number
  effectiveDay: number
}

/** 商户列表项store字段商户信息 */
interface StoreUser {
  audit: IAudit
  isFreeze: boolean
}

/** 商户列表项中的用户信息 */
interface UserData {
  _id: string

  /** 用户账号 */
  account: string

  /** 用户昵称 */
  nickname: string

  /** 用户性别 (保密|女|男) */
  sex: '-1' | '0' | '1'

  /** 用户电话 */
  tel: string

  /** 用户类型 */
  type: IUserType

  /** 创建用户时间 */
  createdAt: string

  /** 商户 */
  store: StoreUser | null

  /** 修改用户时间 */
  updatedAt: string
}

interface UserOtherInfoProps {
  userInfo: UserData
}

/** 商户审核状态 */
export const storeUserAuditStatus = {
  [IAudit.reject]: { color: 'red', label: '审核不通过' },
  [IAudit.await]: { color: 'green', label: '审核中' },
  [IAudit.agree]: { color: 'geekblue', label: '审核通过' },
}


const StoreCoupon: FC = memo(() => {
  /** 表格数据 */
  const [tableData, setTableData] = useState<CouponItem[]>([])

  /** 获取表格数据加载状态 */
  const [isLoading, setLoading] = useState(false)

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)

  /** 分页配置 */
  const pagination: TablePaginationConfig = {
    pageSize: 8,
  }

  /** 发放优惠券 */
  const handlePublishCoupon = (id: string) => {
    const count = window.prompt('发放优惠券数量')
    
    if (isNaN(Number(count))) {
      return message.error('请输入数字！！！')
    }

    publishStoreCoupon(id, Number(count)).then(res=> {
      toggleRefreshFlag(f => !f)
    }).catch(err => {
      console.log(err);
    })
  }
 
  const columns: ColumnsType<any> = [
    {
      title: '优惠券名称',
      align: 'center',
      dataIndex: 'couponName',
      key: 'couponName'
    },
    {
      title: '优惠券额度',
      align: 'center',
      dataIndex: 'subMoney',
      render: text => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: '最低消费',
      align: 'center',
      dataIndex: 'minCharge',
      render: text => <Tag color="gold">{text}</Tag>,
    },
    {
      title: '优惠券库存',
      align: 'center',
      dataIndex: 'count',
      render: text => <Tag color="green">{text}</Tag>,
    },
    {
      title: '有效起始时间',
      align: 'center',
      dataIndex: 'startTime',
      render: text => dayJs(new Date(text)).locale('zh-cn').format('YYYY MM-DD HH:mm:ss'),
    },
    {
      title: '有效结束时间',
      align: 'center',
      dataIndex: 'endTime',
      render: (text, record) => {
        if (record.isPermanent) {
          return '永久'
        }
        return dayJs(new Date(text)).locale('zh-cn').format('YYYY MM-DD HH:mm:ss')
      },
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (...args) => {
        const [, coupon] = args
        return (
          <Button type="primary" ghost onClick={handlePublishCoupon.bind(null, coupon._id)}>
            发放优惠券
          </Button>
        )
      },
    },
  ]


  /** 获取表格数据 */
  useEffect(() => {
    setLoading(true)
    findAuthCoupons<CouponItem[]>().then(res => {
      const { data } = res.data
      setTableData(data)
      setLoading(false)
    })
  }, [refreshFlag])

  return (
    <CommonPanel>
      <Card title="发放优惠券" className="panel-card">
        <CommonTableWra>
          <Table
            rowKey="_id"
            bordered
            columns={columns}
            size="middle"
            dataSource={tableData}
            loading={isLoading}
            pagination={pagination}
            scroll={{ x: 900 }}
          />
        </CommonTableWra>
      </Card>


      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />
    </CommonPanel>
  )
})

export default StoreCoupon
