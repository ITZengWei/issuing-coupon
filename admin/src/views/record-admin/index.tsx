import { FC, useState, memo, useEffect, useRef, useMemo } from 'react'
import { Card, Button, Table, Tag, message } from 'antd'
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
  fetchRecords,
  createRecord,
  updateRecord,
  removeRecord,
} from '../../api/record'
import { WithCountResponseData } from '../../api/types'

interface RecordData {
  _id: string

  /** 记录内容 */
  content: string

  /** 创建记录时间 */
  createdAt: string
}

interface FormResult {
  content: string
}

const RecordAdmin: FC = memo(() => {
  /** 表格数据 */
  const [tableData, setTableData] = useState<RecordData[]>([])

  /** 获取表格数据加载状态 */
  const [isLoading, setLoading] = useState(false)

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  /** 分页配置 */
  const [pagination, setPagination, afterRemove] = useTablePagination({
    pageSize: 8,
  })

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)

  const columns: ColumnsType<any> = [
    {
      title: '记录内容',
      align: 'center',
      dataIndex: 'content',
      ellipsis: true,
      width: '65%',
      key: 'content',
      render: content => <Tag color="volcano">{content}</Tag>,
    },
    {
      title: '记录时间',
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
        const record = args[1] as RecordData

        return (
          <Button.Group>
            <Button danger ghost onClick={() => handleRemove(record._id)}>
              删除
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => handleShowDrawer(record)}
            >
              编辑
            </Button>
          </Button.Group>
        )
      },
    },
  ]

  /** 抽屉框 */
  const drawerRef = useRef<DrawerImperativeProps>(null)

  /** 表单字段数据 */
  const fields: FormDrawerFieldProps[] = useMemo(() => {
    return [{ type: 'input', label: '内容', name: 'content', value: '' }]
  }, [])

  /** 处理展示抽屉 */
  const handleShowDrawer = (editItem: RecordData | null) => {
    drawerRef.current!.openDrawer(handleSubmit, editItem)
  }

  const handleRemove = (recordId: string) => {
    const { openModal, closeModal } = modalRef.current!

    openModal('确定要删除该条记录吗', () => {
      removeRecord(recordId).then(res => {
        const { code } = res.data
        // 删除成功
        if (code === 200) {
          message.success('删除成功')
          afterRemove(tableData.length - 1)
          toggleRefreshFlag(f => !f)
          closeModal()
        }
      })
    })
  }

  const handleSubmit = (result: FormResult, editData: RecordData | null) => {
    const { content } = result

    function afterSuccess(msg: string) {
      message.success(msg)

      toggleRefreshFlag(f => !f)

      drawerRef.current!.closeDrawer()
    }

    if (editData) {
      updateRecord(editData._id, content).then(() =>
        afterSuccess('修改记录成功'),
      )
    } else {
      createRecord(content).then(() => afterSuccess('添加记录成功'))
    }
  }

  /** 获取表格数据 */
  useEffect(() => {
    setLoading(true)
    fetchRecords<WithCountResponseData<RecordData[]>>({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    }).then(res => {
      const {
        data: { list, count },
      } = res.data
      setTableData(list)
      setPagination(pagination => {
        return {
          ...pagination,
          total: count,
        }
      })
      setLoading(false)
    })
  }, [refreshFlag, pagination.current, pagination.pageSize])

  const extraButton = (
    <Button
      size="small"
      type="primary"
      ghost
      onClick={() => handleShowDrawer(null)}
    >
      添加记录
    </Button>
  )

  return (
    <CommonPanel>
      <Card title="记录管理" className="panel-card" extra={extraButton}>
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

      <FormDrawer baseTitle="记录" fields={fields} ref={drawerRef} />
    </CommonPanel>
  )
})

export default RecordAdmin
