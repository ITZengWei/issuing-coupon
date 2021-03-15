import { FC, memo, useRef, useState, useEffect } from 'react'
import { Button, Card, message, Table, Tag, Avatar, Tooltip } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import { CommonPanel, CommonTableWra } from '../analyses/style'
import FormDrawer, {
  FormDrawerFieldProps,
  DrawerImperativeProps,
} from '../../components/form-drawer'
import {
  createGame,
  removeGame,
  updateGame,
  fetchGames,
  CreateGameParams,
} from '../../api/game'
import globalStyle from '../../styles/global-style'

interface GameData extends CreateGameParams {
  _id: string
}

interface FormResult extends CreateGameParams {}

const GameAdmin: FC = memo(() => {
  /** 表格数据 */
  const [tableData, setTableData] = useState<GameData[]>([])

  /** 获取表格数据加载状态 */
  const [isLoading, setLoading] = useState(false)

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)

  /** 抽屉框 */
  const drawerRef = useRef<DrawerImperativeProps>(null)

  const columns: ColumnsType<any> = [
    {
      title: '封面',
      align: 'center',
      dataIndex: 'cover',
      key: 'cover',
      render: src => {
        return <Avatar size={40} src={src} />
      },
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      render: remark => <Tag color="volcano">{remark}</Tag>,
    },
    {
      title: '来源',
      align: 'center',
      dataIndex: 'origin',
      render: origin => <Tag>{origin}</Tag>,
    },
    {
      title: '链接',
      align: 'center',
      dataIndex: 'link',
      render: link => (
        <Tooltip
          title="点击试玩"
          placement="top"
          color={globalStyle['theme-color']}
        >
          <Tag>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (...args) => {
        const album = args[1] as GameData

        return (
          <Button.Group>
            <Button danger ghost onClick={() => handleRemove(album._id)}>
              删除
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => handleShowDrawer(album)}
            >
              编辑
            </Button>
          </Button.Group>
        )
      },
    },
  ]

  /** 表单字段数据 */
  const fields: FormDrawerFieldProps[] = [
    { type: 'upload', label: '封面图', name: 'cover', value: '' },
    { type: 'input', label: '备注', name: 'remark', value: '' },
    { type: 'input', label: '来源', name: 'origin', value: '' },
    {
      type: 'input',
      label: '链接',
      name: 'link',
      value: '',
      rules: [
        { required: true, message: '游戏来源不能为空' },
        { type: 'url', message: '请输入正确链接' },
      ],
    },
  ]

  /** 分页配置 */
  const pagination: TablePaginationConfig = {
    pageSize: 8,
  }

  /** 处理展示抽屉 */
  const handleShowDrawer = (editItem?: GameData) => {
    drawerRef.current!.openDrawer(handleSubmit, editItem)
  }

  const handleRemove = (gameId: string) => {
    const { openModal, closeModal } = modalRef.current!

    openModal('您确定要删除吗?', () => {
      removeGame(gameId).then(res => {
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

  /** 处理提交 */
  const handleSubmit = (result: FormResult, editData: GameData | null) => {
    function afterSuccess(msg: string) {
      message.success(msg)
      toggleRefreshFlag(f => !f)

      drawerRef.current!.closeDrawer()
    }

    if (editData) {
      updateGame(editData._id, result).then(() => afterSuccess('修改游戏成功'))
    } else {
      createGame(result).then(() => afterSuccess('添加游戏成功'))
    }
  }

  /** 获取表格数据 */
  useEffect(() => {
    setLoading(true)
    fetchGames<GameData[]>({}).then(res => {
      const { data } = res.data
      setTableData(data)
      setLoading(false)
    })
  }, [refreshFlag])

  const extraButton = (
    <Button
      size="small"
      type="primary"
      ghost
      onClick={() => handleShowDrawer()}
    >
      游戏录入
    </Button>
  )

  return (
    <CommonPanel>
      <Card title="游戏管理" className="panel-card" extra={extraButton}>
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

      <FormDrawer baseTitle="游戏" fields={fields} ref={drawerRef} />
    </CommonPanel>
  )
})

export default GameAdmin
