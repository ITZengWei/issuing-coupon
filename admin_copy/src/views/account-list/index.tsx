import {
  FC,
  useState,
  memo,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import { Image, Card, Button, Table, Tag, message, Avatar, Empty } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import { CommonPanel, CommonTableWra, CommonFilterWra } from '../analyses/style'
import FormDrawer, {
  FormDrawerFieldProps,
  DrawerImperativeProps,
} from '../../components/form-drawer'
import {
  auditStoreUserStatus,
  createCompany,
  createCouponAdmin,
  createCommon,
  fetchUserList,
  freezeStoreUser,
  removeUser,
  changeBaseInfo,
} from '../../api/user'
import {
  IAudit,
  IUserInfo,
  IUserType,
  StoreInfo,
} from '../../store/module/user/reducer'
import defaultAvatar from '../../asserts/images/default.png'
import FilterInputSearch from '../../components/filter-group/input-search'
import FilterDropDown, {
  menuOption,
} from '../../components/filter-group/drop-down'
import { StoreInfoWrapper } from './style'
import { RealUserType } from '../../utils/person'

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
  store: StoreInfo | null

  /** 修改用户时间 */
  updatedAt: string
}

/** 展示弹框函数 */
interface ShowDrawerFunc {
  (
    type: 'couponAdmin' | 'company' | 'common' | 'editBase',
    editItem: any | null,
  ): void
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

const UserOtherInfo: FC<UserData> = memo(props => {
  const { store } = props

  if (!store) return <Empty description="非商家不存在商户信息" />

  return (
    store && (
      <StoreInfoWrapper>
        <h2>详细信息</h2>
        <p>店铺主真实姓名: {store.name}</p>
        <p>店铺名: {store.storeName}</p>
        <p>商户所在省份: {store.province}</p>
        <p>商户所在城市: {store.city}</p>
        <p>商户身份证: {store.idCard}</p>
        <p>
          店铺LOGO: <Image width={80} src={store.logo} />
        </p>
        <p>
          商户营业执照: <Image width={80} src={store.license} />
        </p>
      </StoreInfoWrapper>
    )
  )
})

const AccountList: FC = memo(() => {
  /** 表格数据 */
  const [tableData, setTableData] = useState<UserData[]>([])

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

  /** 搜索成员 */
  const [filterUserType, setFilterUserType] = useState<string>('')

  const userTypeOptions: Array<menuOption<any>> = [
    { title: '全部', value: '' },
    { title: '商户', value: IUserType.company },
    { title: '优惠券管理员', value: IUserType.couponAdmin },
    { title: '系统管理员', value: IUserType.systemAdmin },
  ]

  /** 过滤后最终的tableData */
  const filterTableDataByUserType = useMemo(() => {
    return tableData.filter(item => {
      if (filterUserType === '') return true
      return item.type === Number(filterUserType)
    })
  }, [tableData, filterUserType])

  /** 抽屉框 */
  const drawerRef = useRef<DrawerImperativeProps>(null)

  /** 抽屉操作类型 */
  const drawerActionType =
    useRef<'couponAdmin' | 'company' | 'common' | 'editBase'>('couponAdmin')

  /** 弹框展示，数据不更新问题 (原因 useRef更改不会更新视图) */
  const [, setRefBug] = useState(false)

  /** 表单字段数据 */
  const fields: FormDrawerFieldProps[] = useMemo(() => {
    if (drawerActionType.current === 'couponAdmin') {
      return [
        { type: 'input', label: '账户', name: 'account', value: '' },
        { type: 'password', label: '密码', name: 'password', value: '' },
        { type: 'input', label: '手机号', name: 'tel', value: '' },
      ] as FormDrawerFieldProps[]
    } else if (drawerActionType.current === 'editBase') {
      return [{ type: 'input', label: '昵称', name: 'nickname', value: '' }]
    }

    return [
      { type: 'input', label: '账户', name: 'account', value: '' },
      { type: 'password', label: '密码', name: 'password', value: '' },
      { type: 'input', label: '手机号', name: 'tel', value: '' },
    ] as FormDrawerFieldProps[]
  }, [drawerActionType.current])

  /** 处理展示抽屉 */
  const handleShowDrawer = useCallback<ShowDrawerFunc>(
    function (type, editItem) {
      /** 改变抽屉表单字段类型 */
      drawerActionType.current = type

      /** 展示弹框 */
      drawerRef.current!.openDrawer(handleSubmit, editItem)

      setRefBug(f => !f)
    },
    [drawerActionType.current],
  )

  const handleSubmit = (result: any, editData: any | null) => {
    function afterSuccess(msg: string) {
      message.success(msg)

      toggleRefreshFlag(f => !f)

      drawerRef.current!.closeDrawer()
    }
    if (drawerActionType.current === 'editBase') {
      const { nickname } = result

      console.log(editData, result)
      changeBaseInfo({ userId: editData._id, nickname }).then(res => {
        const { code } = res.data
        if (code === 200) {
          afterSuccess('修改用户基础信息成功')
        }
      })
      return
    }

    if (drawerActionType.current === 'common') {
      const { account, password, tel } = result

      createCommon(result).then(res => {
        const { code } = res.data
        if (code === 200) {
          afterSuccess('添加普通用户成功')
        }
      })
      return
    }

    /** 如果是优惠券管理员的录入，反之商家 */
    if (drawerActionType.current === 'couponAdmin') {
      const { account, password, tel } = result

      createCouponAdmin(result)
        .then(res => {
          const { code } = res.data
          if (code === 200) {
            afterSuccess('添加优惠券管理员成功')
          }
        })
        .catch(e => {
          console.dir(e)
        })
    } else {
      const { account, password, tel } = result

      /** 对商家操作 */
      createCompany(result).then(res => {
        const { code } = res.data
        if (code === 200) {
          afterSuccess('添加商家成功')
        }
      })
    }
  }

  /** 抽屉表单标题 */
  const drawerTitle = useMemo(() => {
    if (drawerActionType.current === 'common') {
      return '普通用户'
    }
    if (drawerActionType.current === 'company') {
      return '商户'
    }
    if (drawerActionType.current === 'editBase') {
      return '用户'
    }
    return '优惠券管理员'
  }, [drawerActionType.current])

  const columns: ColumnsType<any> = [
    {
      title: '头像',
      align: 'center',
      dataIndex: 'avatar',
      key: 'avatar',
      render: src => {
        return <Avatar size={40} src={src || defaultAvatar} />
      },
    },
    {
      title: '账号',
      align: 'center',
      dataIndex: 'account',
      render: text => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: '用户身份',
      align: 'center',
      dataIndex: 'type',
      render: (...args) => {
        const user = args[1] as IUserInfo
        let obj: any = {
          [RealUserType.store]: { color: 'green', label: '商户' },
          [RealUserType.coupon]: { color: 'yellow', label: '优惠券管理员' },
          [RealUserType.system]: { color: 'red', label: '系统管理员' },
          [RealUserType.common]: { color: '', label: '普通用户' },
        }

        const { type } = user

        let { color, label } = obj[type]

        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'type',
      render: (...args) => {
        const [, user] = args

        const { store, type } = user as IUserInfo

        if (type !== IUserType.company) {
          return '—'
        }

        const { audit } = store!

        if (audit === IAudit.await) {
          return (
            <Button.Group>
              <Button
                size="small"
                type="primary"
                ghost
                onClick={() => handleAuditByType(IAudit.agree, user._id)}
              >
                批准
              </Button>
              <Button
                size="small"
                danger
                ghost
                onClick={() => handleAuditByType(IAudit.reject, user._id)}
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
      title: '手机号',
      key: 'tel',
      align: 'center',
      dataIndex: 'tel',
      render: text => <Tag color="green">{text}</Tag>,
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (...args) => {
        const user = args[1] as UserData

        return (
          <Button.Group>
            <Button danger ghost onClick={() => handleRemove(user._id)}>
              删除
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => handleShowDrawer('editBase', user)}
            >
              编辑
            </Button>
            {user.type === IUserType.company && (
              <Button danger ghost onClick={() => handleFreeze(user)}>
                {user.store!.isFreeze ? '解冻商户' : '冻结商户'}
              </Button>
            )}
          </Button.Group>
        )
      },
    },
  ]

  /** 处理该商户是否冻结 */
  const handleFreeze = (user: UserData) => {
    const { openModal, closeModal } = modalRef.current!
    openModal(
      `此操作会${
        user.store!.isFreeze ? '解冻' : '冻结'
      }商户，商户将无法登录。!是否确认？`,
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

  const handleAuditByType = (auditStatus: IAudit, userId: string) => {
    const { openModal, closeModal } = modalRef.current!
    openModal(
      `是否${auditStatus === IAudit.agree ? '批准' : '拒绝'}该商户`,
      () => {
        auditStoreUserStatus(userId, auditStatus).then(res => {
          const { code } = res.data
          if (code === 200) {
            toggleRefreshFlag(f => !f)
            closeModal()
          }
        })
      },
    )
  }

  const handleRemove = (recordId: string) => {
    const { openModal, closeModal } = modalRef.current!

    openModal('确定要删除该用户吗', () => {
      removeUser(recordId).then(res => {
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
    fetchUserList<UserData[]>().then(res => {
      const { data } = res.data
      setTableData(data)
      setLoading(false)
    })
  }, [refreshFlag])

  return (
    <CommonPanel>
      <Card title="成员展示" className="panel-card">
        <CommonFilterWra>
          <FilterDropDown
            className="split"
            menuOptions={userTypeOptions}
            toggle={setFilterUserType}
          />
          <Button
            type="default"
            style={{ marginLeft: 'auto', marginRight: 10 }}
            onClick={() => handleShowDrawer('common', null)}
          >
            添加普通用户
          </Button>

          <Button
            type="primary"
            style={{ marginRight: 10 }}
            ghost
            onClick={() => handleShowDrawer('company', null)}
          >
            添加商户
          </Button>

          <Button
            danger
            ghost
            onClick={() => handleShowDrawer('couponAdmin', null)}
          >
            添加优惠券管理员
          </Button>
        </CommonFilterWra>

        <CommonTableWra>
          <Table
            rowKey="_id"
            bordered
            columns={columns}
            size="middle"
            dataSource={filterTableDataByUserType}
            loading={isLoading}
            pagination={pagination}
            scroll={{ x: 900 }}
            expandable={{
              expandedRowRender: record => <UserOtherInfo {...record} />,
            }}
          />
        </CommonTableWra>
      </Card>

      {/* 表单抽屉 */}
      <FormDrawer baseTitle={drawerTitle} fields={fields} ref={drawerRef} />

      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />
    </CommonPanel>
  )
})

export default AccountList
