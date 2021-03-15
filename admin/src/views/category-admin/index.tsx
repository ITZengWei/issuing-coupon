import { FC, useRef, useState, useEffect, memo } from 'react'
import { Card, Table, Button, message, Tag, Row, Col, Form, Input } from 'antd'
import { ColumnsType } from 'antd/lib/table'

import CommonModal, { ImperativeProps } from '../../components/common-modal'

import { CommonPanel, CommonTableWra } from '../analyses/style'
import {
  fetchCategories,
  removeCategory,
  updateCategory,
  createCategory,
} from '../../api/category'

export interface CategoryData {
  _id: string
  name: string
}

interface formResult {
  name: string
}

const CategoryAdmin: FC = memo(() => {
  /** 获取表格数据加载状态 */
  const [isLoading, setLoading] = useState(false)

  /** 表格数据 */
  const [tableData, setTableData] = useState<CategoryData[]>([])

  const [form] = Form.useForm()

  /** 编辑Id */
  const [editId, setEditId] = useState<null | string>(null)

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  const columns: ColumnsType<any> = [
    {
      title: '标题',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name: string) => {
        return (
          <Tag color="volcano" className="text-ellipsis">
            {name}
          </Tag>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (...args) => {
        const record = args[1] as CategoryData
        return (
          <Button.Group>
            <Button
              type="primary"
              size="small"
              ghost
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
            <Button
              danger
              ghost
              size="small"
              onClick={() => handleRemove(record._id)}
            >
              删除
            </Button>
          </Button.Group>
        )
      },
    },
  ]
  const handleEdit = (editItem: CategoryData) => {
    setEditId(editItem._id)
    form.setFieldsValue({ name: editItem.name })
  }

  const handleRemove = (articleId: string) => {
    const { openModal, closeModal } = modalRef.current!

    openModal('确定要删除该分类吗?', () => {
      removeCategory(articleId).then(res => {
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

  const handleSubmit = (result: formResult) => {
    const { name } = result

    function afterSuccess(msg: string) {
      message.success(msg)
      toggleRefreshFlag(f => !f)
      form.setFieldsValue({ name: '' })
      editId && setEditId(null)
    }

    if (editId) {
      updateCategory(editId, name).then(() => afterSuccess('修改分类成功'))
    } else {
      createCategory({ name }).then(() => afterSuccess('添加分类成功'))
    }
  }

  /** 获取分类数据 */
  useEffect(() => {
    setLoading(true)
    fetchCategories<CategoryData[]>().then(res => {
      const { data } = res.data
      setTableData(data)
      setLoading(false)
    })
  }, [refreshFlag])

  return (
    <CommonPanel>
      <Card className="panel-card" title="文章栏目">
        <Row justify="space-between">
          <Col xs={24} lg={7}>
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <Form.Item
                label="分类名称"
                name="name"
                rules={[{ required: true, message: '分类名不能为空!' }]}
              >
                <Input placeholder="请输入分类名" />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  {editId ? '保存' : '添加'}
                </Button>
              </Form.Item>
              {editId && (
                <div style={{ textAlign: 'right' }}>
                  <Button onClick={() => setEditId(null)} type="link">
                    取消编辑
                  </Button>
                </div>
              )}
            </Form>
          </Col>
          <Col xs={24} lg={15}>
            <CommonTableWra>
              <Table
                rowKey="_id"
                columns={columns}
                dataSource={tableData}
                loading={isLoading}
                size="middle"
                bordered
                pagination={{ pageSize: 6, simple: true }}
              />
            </CommonTableWra>
          </Col>
        </Row>
      </Card>

      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />
    </CommonPanel>
  )
})

export default CategoryAdmin
