import {
  FC,
  useState,
  memo,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  ReactNode,
} from 'react'
import { Card, Button, Table, Tag, message, Avatar, Descriptions } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import dayJs from 'dayjs'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import { CommonPanel, CommonTableWra, CommonFilterWra } from '../analyses/style'
import FormDrawer, {
  FormDrawerFieldProps,
  DrawerImperativeProps,
} from '../../components/form-drawer'
import { freezeStoreUser } from '../../api/user'
import {
  addCharge,
  addStoreCoupon,
  auditStoreCoupon,
  findReceiveCoupon,
  findStoreCoupons,
  removeStoreCoupon,
  updateStoreCoupon,
} from '../../api/coupon'

import { IAudit, IUserInfo, IUserType } from '../../store/module/user/reducer'

import FilterInputSearch from '../../components/filter-group/input-search'
import FilterDropDown, {
  menuOption,
} from '../../components/filter-group/drop-down'
import { useSelector } from 'react-redux'
import { IStoreState } from '../../store/types'

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

  /** 获取redux中的用户类型 */
  const role = useSelector<IStoreState, IUserType>(state => state.user.role)
  const userId = useSelector<IStoreState, string>(
    state => state.user.userInfo!._id,
  )

  /** 获取表格数据加载状态 */
  const [isLoading, setLoading] = useState(false)

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)

  /** 核销弹框 */
  const chargeModalRef = useRef<ImperativeProps>(null)

  /** 核销内容 */
  const [chargeContent, setChargeContent] = useState<ReactNode>(null)

  /** 分页配置 */
  const pagination: TablePaginationConfig = {
    pageSize: 8,
  }

  /** 搜索标题 */
  const [searchCoupon, setSearchCoupon] = useState('')

  /** 抽屉框 */
  const drawerRef = useRef<DrawerImperativeProps>(null)

  /** 弹框展示，数据不更新问题 (原因 useRef更改不会更新视图) */
  const [, setRefBug] = useState(false)

  /** 表单字段数据 */
  const fields: FormDrawerFieldProps[] = useMemo(() => {
    return [
      { type: 'input', label: '优惠券名称', name: 'couponName', value: '' },
      { type: 'input', label: '优惠券额度', name: 'subMoney', value: '' },
      { type: 'input', label: '最低消费', name: 'minCharge', value: '' },
      {
        type: 'input',
        label: '有效时长(-1: 永久，单位天)',
        name: 'effectiveDay',
        value: '',
      },
    ] as FormDrawerFieldProps[]
  }, [])

  /** 处理核销 */
  const handleCharge = useCallback(async function () {
    const receiveId = window.prompt('输入需要核销的优惠券')

    if (receiveId === null) {
      return
    }
    try {
      const {
        data: { data },
      } = await findReceiveCoupon(receiveId.trim())

      setChargeContent(receiveId)

      const { openModal, closeModal } = modalRef.current!

      openModal(receiveId, () => {
        addCharge(receiveId).then(res => {
          const { code } = res.data
          if (code === 200) {
            message.success('核销成功')
            closeModal()
          }
        })
      })
    } catch (e) {
      return message.warn('请输入正确优惠码')
    }
  }, [])

  /** 处理展示抽屉 */
  const handleShowDrawer = useCallback(function (editItem) {
    /** 展示弹框 */
    drawerRef.current!.openDrawer(handleSubmit, editItem)
    setRefBug(f => !f)
  }, [])

  const handleSubmit = (result: AddCouponProps, editData: any | null) => {
    function afterSuccess(msg: string) {
      message.success(msg)

      toggleRefreshFlag(f => !f)

      drawerRef.current!.closeDrawer()
    }
    if (editData) {
      updateStoreCoupon(result, editData._id)
        .then(res => {
          const { code } = res.data
          if (code === 200) {
            afterSuccess('修改优惠券成功')
          }
        })
        .catch(e => {
          console.dir(e)
        })
    } else {
      addStoreCoupon(result)
        .then(res => {
          const { code } = res.data
          if (code === 200) {
            afterSuccess('添加优惠券成功')
          }
        })
        .catch(e => {
          console.dir(e)
        })
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: '优惠券名称',
      align: 'center',
      dataIndex: 'couponName',
      key: 'couponName',
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
      title: '状态',
      align: 'center',
      dataIndex: 'audit',
      render: (...args) => {
        console.log(args)
        const [, coupon] = args

        const { audit } = coupon as CouponItem

        if (role !== IUserType.couponAdmin) {
          return '—'
        }

        if (audit === IAudit.await) {
          return (
            <Button.Group>
              <Button
                size="small"
                type="primary"
                ghost
                onClick={() => handleAuditByType(IAudit.agree, coupon._id)}
              >
                批准
              </Button>
              <Button
                size="small"
                danger
                ghost
                onClick={() => handleAuditByType(IAudit.reject, coupon._id)}
              >
                拒绝
              </Button>
            </Button.Group>
          )
        }

        const { color, label } = storeUserAuditStatus[audit]
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: '有效起始时间',
      align: 'center',
      dataIndex: 'startTime',
      render: text =>
        dayJs(new Date(text)).locale('zh-cn').format('YYYY MM-DD HH:mm:ss'),
    },
    {
      title: '有效结束时间',
      align: 'center',
      dataIndex: 'endTime',
      render: (text, record) => {
        if (record.isPermanent) {
          return '永久'
        }
        return dayJs(new Date(text))
          .locale('zh-cn')
          .format('YYYY MM-DD HH:mm:ss')
      },
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (...args) => {
        const coupon = args[1] as CouponItem
        return (
          <Button.Group>
            <Button danger ghost onClick={() => handleRemove(coupon._id)}>
              删除
            </Button>
            {coupon.userId === userId && (
              <Button
                type="primary"
                ghost
                onClick={() => handleShowDrawer(coupon)}
              >
                编辑
              </Button>
            )}
          </Button.Group>
        )
      },
    },
  ]

  const handleFreeze = (user: UserData) => {
    const { openModal, closeModal } = modalRef.current!
    openModal(
      `此操作会${
        user.store!.isFreeze ? '解冻' : '冻结'
      }优惠券，优惠券将无法登录。!是否确认？`,
      () => {
        freezeStoreUser(user._id, !user.store!.isFreeze).then(res => {
          const { code } = res.data
          if (code === 200) {
            toggleRefreshFlag(f => !f)
            closeModal()
          }
        })
      },
    )
  }

  const handleAuditByType = (auditStatus: IAudit, couponId: string) => {
    const { openModal, closeModal } = modalRef.current!
    openModal(
      `是否${auditStatus === IAudit.agree ? '批准' : '拒绝'}该优惠券`,
      () => {
        auditStoreCoupon(auditStatus, couponId).then(res => {
          const { code } = res.data
          if (code === 200) {
            toggleRefreshFlag(f => !f)
            closeModal()
          }
        })
      },
    )
  }

  const handleRemove = (id: string) => {
    const { openModal, closeModal } = modalRef.current!

    openModal('确定要删除该优惠券吗', () => {
      removeStoreCoupon(id).then(res => {
        const { code } = res.data
        // 删除成功
        if (code === 200) {
          message.success('删除成功')
          toggleRefreshFlag(f => !f)
          closeModal()
        }
      })
    })
  }

  /** 获取表格数据 */
  useEffect(() => {
    setLoading(true)
    findStoreCoupons<CouponItem[]>(searchCoupon).then(res => {
      const { data } = res.data
      setTableData(data)
      setLoading(false)
    })
  }, [refreshFlag, searchCoupon])

  return (
    <CommonPanel>
      <Card title="优惠券展示" className="panel-card">
        <CommonFilterWra>
          <FilterInputSearch
            className="split"
            placeholder="根据优惠券搜索"
            onPress={setSearchCoupon}
          />

          <div style={{ marginLeft: 'auto', marginRight: 10 }}>
            <Button
              type="primary"
              style={{ marginLeft: 'auto', marginRight: 10 }}
              ghost
              onClick={() => handleShowDrawer(null)}
            >
              发行优惠券
            </Button>

            <Button type="primary" danger ghost onClick={() => handleCharge()}>
              核销优惠券
            </Button>
          </div>
        </CommonFilterWra>

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

      {/* 表单抽屉 */}
      <FormDrawer baseTitle="优惠券" fields={fields} ref={drawerRef} />

      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />

      {/* 核销弹框 defaultContent={chargeContent}  */}
      <CommonModal ref={chargeModalRef} />
    </CommonPanel>
  )
})

export default StoreCoupon
