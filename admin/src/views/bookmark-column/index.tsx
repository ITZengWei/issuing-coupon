import { FC, useState, memo, useEffect, useRef, useMemo } from 'react'
import { Card, Button, Table, Tag, message } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import arrayMove from 'array-move'
import {
  SortableHandle,
  SortableContainer,
  SortableElement,
} from 'react-sortable-hoc'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import { CommonPanel, CommonTableWra } from '../analyses/style'
import FormDrawer, {
  FormDrawerFieldProps,
  DrawerImperativeProps,
} from '../../components/form-drawer'
import { WithCountResponseData } from '../../api/types'
import {
  BookmarkColumnData,
  createBookmarkColumn,
  updateBookmarkColumn,
  fetchBookmarkColumn,
  removeBookmarkColumn,
} from '../../api/bookmark'
import { getAntdIconByIconStr } from '../../utils/menu'
import useTablePagination from '../../hooks/use-table-pagination'

interface FormResult {
  /** 书栏名称 */
  name: string

  /** 书栏图标 */
  icon: string
}

/** 拖拽控制 */
const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
))

const SortableItem = SortableElement((props: any) => {
  return <tr className="sortItem" {...props} />
})
const SortableWrapper = SortableContainer((props: any) => {
  return <tbody className="sortWra" {...props} />
})

const BookmarkColumn: FC = memo(() => {
  /** 表格数据 */
  const [tableData, setTableData] = useState<BookmarkColumnData[]>([])

  /** 获取表格数据加载状态 */
  const [isLoading, setLoading] = useState(false)

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)

  /** 分页配置 */
  const [pagination, setPagination, afterRemove] = useTablePagination({
    pageSize: 8,
  })

  const columns: ColumnsType<any> = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 66,
      className: 'drag-visible',
      align: 'center',
      render: () => <DragHandle />,
    },
    {
      title: '栏目名称',
      align: 'center',
      dataIndex: 'name',
      ellipsis: true,
      className: 'drag-visible',
      key: 'name',
      render: name => <Tag color="volcano">{name}</Tag>,
    },
    {
      title: '栏目图标',
      key: 'icon',
      align: 'center',
      dataIndex: 'icon',
      render: icon => (icon ? getAntdIconByIconStr(icon) : <span>-</span>),
    },
    {
      title: '所含书签数',
      key: 'bookmarks',
      align: 'center',
      dataIndex: 'bookmarks',
      render: (bookmarks: any[]) => {
        return <Tag>{bookmarks.length}</Tag>
      },
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (...args) => {
        const record = args[1] as BookmarkColumnData

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
    return [
      { type: 'input', label: '书栏名称', name: 'name', value: '' },
      { type: 'icon', label: '书栏图标', name: 'icon', value: '' },
    ] as FormDrawerFieldProps[]
  }, [])

  /** 处理展示抽屉 */
  const handleShowDrawer = (editItem: BookmarkColumnData | null) => {
    drawerRef.current!.openDrawer(handleSubmit, editItem)
  }

  const handleRemove = (columnId: string) => {
    const { openModal, closeModal } = modalRef.current!

    openModal('删除该栏目，栏目对应的书签将会删除，是否确定?', () => {
      removeBookmarkColumn(columnId).then(res => {
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

  /** 更改栏目索引 */
  const exchangeColumnIndex = (oldIndex: number, newIndex: number) => {
    if (oldIndex !== newIndex) {
      const { _id: oldId, name: oldName } = tableData[oldIndex]!
      const { _id: newId, name: newName } = tableData[newIndex]!
      Promise.all([
        updateBookmarkColumn(oldId, { index: newIndex }),
        updateBookmarkColumn(newId, { index: oldIndex }),
      ]).then(res => {
        // if (res.every(v => v.data.code === 200)) {
        //   console.log('修改成功')
        // }
      })
    }
  }

  const handleSubmit = (
    result: FormResult,
    editData: BookmarkColumnData | null,
  ) => {
    const { name, icon } = result

    function afterSuccess(msg: string) {
      message.success(msg)

      toggleRefreshFlag(f => !f)

      drawerRef.current!.closeDrawer()
    }

    if (editData) {
      updateBookmarkColumn(editData._id, { name, icon }).then(() =>
        afterSuccess('修改栏目成功'),
      )
    } else {
      createBookmarkColumn({ name, icon }).then(() =>
        afterSuccess('添加栏目成功'),
      )
    }
  }

  /** 获取表格数据 */
  useEffect(() => {
    setLoading(true)
    fetchBookmarkColumn<WithCountResponseData<BookmarkColumnData[]>>(
      {} as any,
    ).then(res => {
      const {
        data: { list, count },
      } = res.data
      setPagination(pagination => {
        return {
          ...pagination,
          total: count,
        }
      })
      setTableData(list)
      setLoading(false)
    })
  }, [refreshFlag])

  const extraButton = (
    <Button
      size="small"
      type="primary"
      ghost
      onClick={() => handleShowDrawer(null)}
    >
      添加栏目
    </Button>
  )

  const onSortEnd = (event: any) => {
    const { oldIndex, newIndex } = event
    console.log(oldIndex, newIndex)
    if (oldIndex !== newIndex) {
      const newData = arrayMove([...tableData], oldIndex, newIndex).filter(
        el => !!el,
      )
      /** 修改真实数据 */
      exchangeColumnIndex(oldIndex, newIndex)
      setTableData(newData)
    }
  }

  const DraggableContainer = (props: any) => (
    <SortableWrapper
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  )

  const DraggableBodyRow = (props: any) => {
    const { className, style, ...restProps } = props
    // 函数findIndex基于表rowKey props，应该始终是一个正确的数组索引
    const index = tableData.findIndex(x => x._id === restProps['data-row-key'])
    return <SortableItem index={index} {...restProps} />
  }

  return (
    <CommonPanel>
      <Card title="栏目管理" className="panel-card" extra={extraButton}>
        <CommonTableWra>
          <Table
            rowKey="_id"
            bordered
            columns={columns}
            size="middle"
            dataSource={tableData}
            loading={isLoading}
            pagination={pagination}
            components={{
              body: {
                wrapper: DraggableContainer,
                row: DraggableBodyRow,
              },
            }}
            scroll={{ x: 900 }}
          />
        </CommonTableWra>
      </Card>

      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />

      <FormDrawer baseTitle="栏目" fields={fields} ref={drawerRef} />
    </CommonPanel>
  )
})

export default BookmarkColumn
