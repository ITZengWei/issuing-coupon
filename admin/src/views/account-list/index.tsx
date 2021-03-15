import { FC, useState, memo, useEffect, useRef, useMemo } from 'react'
import { Card, Button, Table, Tag, message, Avatar, Descriptions } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import dayJs from 'dayjs'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import { CommonPanel, CommonTableWra } from '../analyses/style'
import { changeLevel, fetchUserList, removeUser } from '../../api/user'
import { IUserType } from '../../store/module/user/reducer'
import defaultAvatar from '../../asserts/images/default.png'
import { getUserType } from '../../utils/person'

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
  type: '0' | '1' | '2'

  /** 创建用户时间 */
  createdAt: string

  /** 修改用户时间 */
  updatedAt: string
}

interface UserOtherInfoProps {
  userInfo: UserData
}

const UserOtherInfo: FC<UserOtherInfoProps> = memo(props => {
  const {
    userInfo: { tel, nickname, sex },
  } = props
  return (
    <Descriptions bordered>
      <Descriptions.Item label="昵称">{nickname}</Descriptions.Item>
      <Descriptions.Item label="手机号">
        <a href={`tel:${tel}`} style={{ color: 'inherit' }}>
          {tel}
        </a>
      </Descriptions.Item>
      <Descriptions.Item label="性别">
        {sex === '-1' ? '保密' : sex === '0' ? '女' : '男'}
      </Descriptions.Item>
    </Descriptions>
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
      render: text => <Tag color="volcano">{text}</Tag>,
    },
    {
      title: '用户等级',
      align: 'center',
      dataIndex: 'type',
      render: (...args) => {
        const user = args[1]
        let obj = {
          '0': { color: 'green', label: '普通' },
          '1': { color: 'yellow', label: '初级管理员' },
          '2': { color: 'red', label: '高级管理员' },
        }
        const userType = getUserType(user)

        let { color, label } = obj[userType]

        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'type',
      render: audit => {
        audit = 1
        let obj = {
          '-1': { color: 'red', label: '审核不通过' },
          '0': { color: 'green', label: '审核中' },
          '1': { color: 'geekblue', label: '审核通过' },
        }
        let { color, label } = (obj as any)[audit]
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: '注册日期',
      key: 'createdAt',
      align: 'center',
      dataIndex: 'createdAt',
      render: createdAt => (
        <Tag color="green">{dayJs(createdAt).format('YYYY-MM-DD')}</Tag>
      ),
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
              onClick={() => handleChangeLevel(user)}
            >
              更改等级
            </Button>
          </Button.Group>
        )
      },
    },
  ]

  const handleChangeLevel = (user: UserData) => {
    const { openModal, closeModal } = modalRef.current!
    openModal('此操作会修改用户的权限!是否确认？', () => {
      const command = window.prompt('请输入口令')?.trim()

      if (command !== 'wei110349') {
        closeModal()
        return message.warning('口令错误')
      }

      const level = window
        .prompt(
          `请输入修改更改的类型：普通(${IUserType.common})|管理员(${IUserType.admin})|超级管理员(${IUserType.superAdmin})`,
        )
        ?.trim()

      if (
        level &&
        level in [IUserType.common, IUserType.admin, IUserType.superAdmin]
      ) {
        changeLevel(user._id, level).then(res => {
          const { code } = res.data
          if (code === 200) {
            toggleRefreshFlag(f => !f)
            closeModal()
          }
        })
      } else {
        closeModal()
        return message.warning('用户类型填写错误！')
      }
    })
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
      <Card title="用户列表" className="panel-card">
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
            expandable={{
              expandedRowRender: userInfo => (
                <UserOtherInfo userInfo={userInfo} />
              ),
            }}
          />
        </CommonTableWra>
      </Card>

      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />
    </CommonPanel>
  )
})

export default AccountList
