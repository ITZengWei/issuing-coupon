import { FC, memo, useState, useEffect, useRef } from 'react'
import dayJs from 'dayjs'
import { Card, Table, Tag, Button, message, Switch } from 'antd'
import { useHistory } from 'react-router-dom'
import { ColumnsType } from 'antd/lib/table'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import FilterInputSearch from '../../components/filter-group/input-search'
import FilterDropDown, {
  menuOption,
} from '../../components/filter-group/drop-down'
import { CommonPanel, CommonFilterWra, CommonTableWra } from '../analyses/style'
import {
  fetchArticleList,
  deleteArticle,
  FetchArticleListParams,
} from '../../api/article'
import { ArticleStatus, ArticleData } from '../add-article'
import { CategoryData } from '../category-admin'
import { WithCountResponseData } from '../../api/types'
import useTablePagination from '../../hooks/use-table-pagination'

const ArticleList: FC = () => {
  const history = useHistory()
  /** 发布状态 */
  const [publishStatus, setPublishStatus] = useState<string>('')

  /** 获取表格数据加载状态 */
  const [isLoading, setLoading] = useState(false)

  const publishStatusOptions: Array<menuOption<any>> = [
    { title: '全部', value: '' },
    { title: '已发布', value: '1' },
    { title: '草稿', value: '0' },
  ]

  /** 搜索标题 */
  const [searchTitle, setSearchTitle] = useState('')

  /** 表格数据 */
  const [tableData, setTableData] = useState<ArticleData[]>([])

  /** 当前选中的行 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)

  /** 选中列表 */
  const rowSelection = {
    onChange: (selectKeys: string[]) => {
      setSelectedRowKeys(selectKeys)
    },
    selectedRowKeys,
  }

  const columns: ColumnsType<any> = [
    {
      title: '标题',
      align: 'center',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string) => {
        return (
          <Tag color="volcano" className="text-ellipsis">
            {title}
          </Tag>
        )
      },
    },
    {
      title: '作者',
      align: 'center',
      dataIndex: 'author',
      render: (author: string) => <Tag color="gold">{author}</Tag>,
    },
    {
      title: '分类',
      align: 'center',
      dataIndex: 'category',
      render: (category?: CategoryData) => {
        return <Tag color="magenta">{category ? category.name : '其他'}</Tag>
      },
    },

    {
      title: '发表日期',
      align: 'center',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (createdAt: string) => (
        <Tag color="geekblue">
          {dayJs(createdAt).format('YYYY-MM-DD HH:ss')}
        </Tag>
      ),
    },
    {
      title: '完成状态',
      align: 'center',
      key: 'completed',
      dataIndex: 'completed',
      render: (completed: boolean) => {
        return <Tag color="magenta">{completed ? '已发布' : '草稿'}</Tag>
        //   return  <Switch
        //   checkedChildren="发布"
        //   unCheckedChildren="草稿"
        //   checked={completed}
        // />
      },
    },

    {
      title: '文章操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (...args) => {
        const record = args[1] as ArticleData
        return (
          <Button.Group>
            <Button
              type="primary"
              ghost
              onClick={() => {
                history.push(`/article/add/${record._id}`)
              }}
            >
              编辑
            </Button>
            <Button danger ghost onClick={() => handleRemove(record._id)}>
              删除
            </Button>
          </Button.Group>
        )
      },
    },
  ]

  /** 分页设置 */
  const [pagination, setPagination] = useTablePagination({
    pageSize: 6,
    simple: true,
  })

  /** 删除后检查数据，如果当前表格数据只有一条，页码往前面走。 => 获取数据 */
  const delAfterCheckData = () => {
    if (tableData.length === 0) {
      setPagination(pagination => {
        const newCurrent = pagination.current! - 1
        return {
          ...pagination,
          current: newCurrent <= 1 ? 1 : newCurrent,
        }
      })
    }

    /** 重新获取 */
    toggleRefreshFlag(flag => !flag)
  }

  const handleRemove = (param: string | string[]) => {
    const { openModal, closeModal } = modalRef.current!

    let content
    if (Array.isArray(param)) {
      // 批量删除
      content = `该操作会删除${param.length}篇文章，请谨慎操作!!!`
    } else {
      content = '确定要删除该篇文章吗?'
    }

    openModal(content, () => {
      deleteArticle(param)
        .then(res => {
          const { code } = res.data
          // 删除成功
          if (code === 200) {
            // 检查数据
            delAfterCheckData()
            message.success('删除成功')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(() => closeModal())
    })
  }

  /** 获取表格数据 */
  useEffect(() => {
    setLoading(true)

    const params: FetchArticleListParams = {
      completed:
        publishStatus === ''
          ? undefined
          : publishStatus === ArticleStatus.published,
      title: searchTitle,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    }

    fetchArticleList<WithCountResponseData<ArticleData[]>>(params).then(res => {
      const { count, list } = res.data.data
      setTableData(list)
      setPagination(pagination => ({
        ...pagination,
        total: count, //data.length
      }))
      setLoading(false)
    })
  }, [
    publishStatus,
    searchTitle,
    pagination.current,
    pagination.pageSize,
    refreshFlag,
  ])

  return (
    <CommonPanel>
      <Card className="panel-card" title="文章列表">
        <CommonFilterWra>
          <FilterDropDown
            className="split"
            menuOptions={publishStatusOptions}
            toggle={setPublishStatus}
          />

          <FilterInputSearch
            className="split"
            placeholder="根据文章标题搜索"
            onPress={setSearchTitle}
          />

          {/* 批量删除 */}
          {selectedRowKeys.length > 0 && (
            <Button danger ghost onClick={() => handleRemove(selectedRowKeys)}>
              批量删除
            </Button>
          )}
        </CommonFilterWra>

        <CommonTableWra>
          <Table
            rowKey="_id"
            rowSelection={rowSelection as any}
            columns={columns}
            size="middle"
            dataSource={tableData}
            loading={isLoading}
            pagination={pagination}
            scroll={{ x: 1280 }}
          />
        </CommonTableWra>
      </Card>

      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />
    </CommonPanel>
  )
}

export default memo(ArticleList)
