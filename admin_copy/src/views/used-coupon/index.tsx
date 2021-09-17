import {
  FC,
  useState,
  memo,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import {
  Card,
  Button,
  Table,
  Tag,
  message,
  Descriptions,
  Typography,
} from 'antd'
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
  addStoreCoupon,
  auditStoreCoupon,
  findUsedCoupons,
  removeReceiveCoupon,
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

function format(time: string) {
  const dt = new Date(time) //new实例
  console.log(time)

  const y = dt.getFullYear() //获取年
  //获取月 日 时等等     其中月默认从0开始所以+1
  //使用空字符串转为string类型
  //使用padStart方法补0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

/** 已使用的优惠券字段 */
interface UsedCouponItem {
  used: boolean
  cleanFlag: boolean
  couponId: CouponItem
}

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
  removeFlag?: boolean
  minCharge?: number
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

const CouponDetials: FC<CouponItem> = memo(props => {
  console.log(props)

  const startTime = format(props.startTime)

  const endTime = format(props.endTime)

  return (
    <div>
      <h2 style={{ marginBottom: '10px', fontSize: '17px', fontWeight: 700 }}>
        详细信息
      </h2>
      <Typography.Paragraph>
        优惠券名称: {props.couponName}
      </Typography.Paragraph>
      <Typography.Paragraph>优惠券额度: {props.subMoney}</Typography.Paragraph>
      <Typography.Paragraph>最低消费: {props.minCharge}</Typography.Paragraph>
      <Typography.Paragraph>状态: {props.audit}</Typography.Paragraph>
      <Typography.Paragraph>有效起始时间: {startTime}</Typography.Paragraph>
      <Typography.Paragraph>有效结束时间: {endTime}</Typography.Paragraph>
    </div>
  )
})

/** 商户审核状态 */
export const storeUserAuditStatus = {
  [IAudit.reject]: { color: 'red', label: '审核不通过' },
  [IAudit.await]: { color: 'green', label: '审核中' },
  [IAudit.agree]: { color: 'geekblue', label: '审核通过' },
}

const UsedCoupon: FC = memo(() => {
  /** 表格数据 */
  const [tableData, setTableData] = useState<UsedCouponItem[]>([])

  /** 获取表格数据加载状态 */
  const [isLoading, setLoading] = useState(false)

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)
  /** 分页配置 */
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
  })

  const columns: ColumnsType<any> = [
    {
      title: '优惠券名称',
      align: 'center',
      dataIndex: 'couponName',
      key: 'couponName',
      render: (text, record) => (
        <>{record.couponId && record.couponId.couponName}</>
      ),
    },
    {
      title: '最低消费',
      align: 'center',
      dataIndex: 'minCharge',
      render: (text, record) => (
        <>{record.couponId && record.couponId.minCharge}</>
      ),
    },
    {
      title: '是否使用',
      align: 'center',
      dataIndex: 'used',
      render: text => <Tag color="geekblue">{text ? '已使用' : '未使用'}</Tag>,
    },
    {
      title: '是否清除',
      align: 'center',
      dataIndex: 'cleanFlag',
      render: text => <Tag color="gold">{text ? '已清除' : '未清除'}</Tag>,
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (...args) => {
        const coupon = args[1] as CouponItem
        return (
          <Button danger ghost onClick={() => handleRemove(coupon._id)}>
            删除
          </Button>
        )
      },
    },
  ]
  const handleRemove = (id: string) => {
    const { openModal, closeModal } = modalRef.current!

    openModal('确定要删除吗', () => {
      removeReceiveCoupon(id).then(res => {
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
    findUsedCoupons<any>({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    }).then(res => {
      const { data } = res.data
      setTableData(data.list)
      setLoading(false)
    })
  }, [refreshFlag])

  return (
    <CommonPanel>
      <Card title="使用的优惠券明细" className="panel-card">
        <CommonTableWra>
          <Table
            rowKey="_id"
            bordered
            columns={columns}
            size="middle"
            dataSource={tableData}
            loading={isLoading}
            pagination={{
              ...pagination,
              onChange: (page, pageSize) => {
                setPagination({
                  current: page,
                  pageSize: pageSize as number,
                })
                toggleRefreshFlag(true)
              },
            }}
            scroll={{ x: 900 }}
            expandable={{
              expandedRowRender: record => {
                return <CouponDetials {...record.couponId} />
              },
            }}
          />
        </CommonTableWra>
      </Card>

      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />
    </CommonPanel>
  )
})

export default UsedCoupon
