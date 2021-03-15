import { FC, memo, useRef, useState, useEffect } from 'react'
import { Button, Card, message, Table, Tag, Image } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import dayJs from 'dayjs'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import { CommonPanel, CommonTableWra } from '../analyses/style'
import FormDrawer, {
  FormDrawerFieldProps,
  DrawerImperativeProps,
} from '../../components/form-drawer'
import useTablePagination from '../../hooks/use-table-pagination'
import {
  createAlbum,
  removeAlbum,
  updateAlbum,
  fetchAlbums,
  CreateAlbumParams,
} from '../../api/album'

import { WithCountResponseData } from '../../api/types'

interface AlbumData extends CreateAlbumParams {
  _id: string
}

interface FormResult extends CreateAlbumParams {}

export const fallbackImg =
  'data:image/png;base64,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'

const AlbumAdmin: FC = memo(() => {
  /** 表格数据 */
  const [tableData, setTableData] = useState<AlbumData[]>([])

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
      title: '图景',
      align: 'center',
      dataIndex: 'prospect',
      key: 'prospect',
      render: src => {
        return <Image width={64} height={64} src={src} fallback={fallbackImg} />
      },
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      render: remark => <Tag color="volcano">{remark}</Tag>,
    },

    {
      title: '添加时间',
      align: 'center',
      key: 'createdAt',
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
        const album = args[1] as AlbumData

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
    { type: 'upload', label: '图景', name: 'prospect', value: '' },
    { type: 'input', label: '备注', name: 'remark', value: '', rules: [] },
  ]

  /** 分页设置 */
  const [pagination, setPagination, afterRemove] = useTablePagination({
    pageSize: 5,
  })

  /** 处理展示抽屉 */
  const handleShowDrawer = (editItem?: AlbumData) => {
    drawerRef.current!.openDrawer(handleSubmit, editItem)
  }

  const handleRemove = (albumId: string) => {
    const { openModal, closeModal } = modalRef.current!

    openModal('您确定要删除吗?', () => {
      removeAlbum(albumId).then(res => {
        const { code } = res.data
        // 删除成功
        if (code === 200) {
          message.success('删除成功')
          toggleRefreshFlag(f => !f)

          afterRemove(tableData.length - 1)
          closeModal()
        }
      })
    })
  }

  /** 处理提交 */
  const handleSubmit = (result: FormResult, editData: AlbumData | null) => {
    function afterSuccess(msg: string) {
      message.success(msg)
      toggleRefreshFlag(f => !f)

      drawerRef.current!.closeDrawer()
    }

    if (editData) {
      updateAlbum(editData._id, result).then(() => afterSuccess('修改相册成功'))
    } else {
      createAlbum(result).then(() => afterSuccess('添加相册成功'))
    }
  }

  /** 获取表格数据 */
  useEffect(() => {
    setLoading(true)
    fetchAlbums<WithCountResponseData<AlbumData[]>>({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    }).then(res => {
      const { count, list } = res.data.data
      setTableData(list)
      setPagination(pagination => ({
        ...pagination,
        total: count, //data.length
      }))
      setLoading(false)
    })
  }, [refreshFlag, pagination.current, pagination.pageSize])

  const extraButton = (
    <Button
      size="small"
      type="primary"
      ghost
      onClick={() => handleShowDrawer()}
    >
      添加相册
    </Button>
  )

  return (
    <CommonPanel>
      <Card title="相册管理" className="panel-card" extra={extraButton}>
        <CommonTableWra>
          <Table
            rowKey="_id"
            bordered
            columns={columns}
            size="middle"
            dataSource={tableData}
            loading={isLoading}
            scroll={{ x: 900 }}
            pagination={pagination}
          />
        </CommonTableWra>
      </Card>

      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />

      <FormDrawer baseTitle="相册" fields={fields} ref={drawerRef} />
    </CommonPanel>
  )
})

export default AlbumAdmin
