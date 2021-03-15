import { FC, useState, memo, useEffect, useRef, useMemo } from 'react'
import { Card, Button, Table, Tag, message } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { InputNumberProps } from 'antd/lib/input-number'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import { CommonPanel, CommonTableWra } from '../analyses/style'
import FormDrawer, {
  FormDrawerFieldProps,
  DrawerImperativeProps,
} from '../../components/form-drawer'
import { IAsideMenu } from '../../components/container/container-aside'
import {
  updateMenu,
  fetchMenus,
  removeMenu,
  createMenu,
  CreateMenuPayload,
} from '../../api/menu'
import {
  arr2menu,
  getAntdIconByIconStr,
  getRemoveMenuIds,
} from '../../utils/menu'

import { IUserType } from '../../store/module/user/reducer'
import { useFormSelectProps } from '../../components/form-drawer/form-select'

interface RecordData {
  _id: string

  /** 记录内容 */
  content: string

  /** 创建记录时间 */
  createdAt: string
}

export interface MenuData extends IAsideMenu {}

interface FormResult {
  /** 菜单路径 */
  path: string

  /** 菜单名称 */
  title: string

  /** 菜单图标 */
  icon: any

  /** 菜单位置索引 */
  index: number

  /** 权限 */
  auth: IUserType[]
}

export interface ResponseMenuItemData {
  _id: string
  createdAt: string
  icon: string
  index: number
  path: string
  title: string
  parentId: string
  topIds: string[]
  auth: IUserType[]
  updatedAt: string
}

interface ResponseMenuData {
  /** 表格记录数 */
  count: number

  menus: Array<ResponseMenuItemData>
}

const MenuList: FC = memo(() => {
  /** 表格数据 */
  const [tableData, setTableData] = useState<MenuData[]>([])

  /** 获取表格数据加载状态 */
  const [isLoading, setLoading] = useState(false)

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)

  /** 父级菜单信息 */
  const parentMenuInfo = useRef<MenuData | null>(null)

  const columns: ColumnsType<any> = [
    {
      title: '菜单名称',
      align: 'center',
      dataIndex: 'title',
      ellipsis: true,
      key: 'title',
      render: title => <Tag color="volcano">{title}</Tag>,
    },
    {
      title: '菜单图标',
      align: 'center',
      dataIndex: 'icon',
      ellipsis: true,
      key: 'icon',
      render: icon => {
        return icon ? getAntdIconByIconStr(icon) : <span>-</span>
      },
    },

    {
      title: '菜单路径',
      key: 'path',
      align: 'center',
      dataIndex: 'path',
      render: path => <Tag color="green">{path}</Tag>,
    },
    // {
    //   title: '菜单索引',
    //   key: 'index',
    //   align: 'center',
    //   dataIndex: 'index',
    //   render: index => <Tag color="green">{index}</Tag>,
    // },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (...args) => {
        const menu = args[1] as MenuData
        return (
          <Button.Group>
            <Button danger ghost onClick={() => handleRemove(menu)}>
              删除
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => handleShowDrawer('addSubMenu', menu)}
            >
              添加子菜单
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => handleShowDrawer('editMenu', menu)}
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
    const numberPayload: InputNumberProps = {
      max: 9999,
      min: 100,
      defaultValue: 100,
    }

    const authPayload: useFormSelectProps = {
      options: [
        { value: IUserType.common, name: '公共' },
        { value: IUserType.admin, name: '管理员' },
        { value: IUserType.superAdmin, name: '超级管理员' },
      ],
      selectProps: { mode: 'multiple' },
    }

    return [
      { type: 'input', label: '标题', name: 'title', value: '' },
      { type: 'input', label: '路径', name: 'path', value: '' },
      { type: 'icon', label: '图标', name: 'icon', value: '', rules: [] },
      {
        type: 'number',
        label: '位置索引',
        name: 'index',
        value: '',
        payload: numberPayload,
      },
      {
        type: 'select',
        label: '权限',
        name: 'auth',
        value: '',
        payload: authPayload,
      },
    ] as FormDrawerFieldProps[]
  }, [])

  /** 处理展示抽屉 */
  const handleShowDrawer = (
    actionType: 'addMenu' | 'addSubMenu' | 'editMenu',
    editItem: MenuData | null,
  ) => {
    if (actionType === 'addMenu') {
      parentMenuInfo.current = null
      drawerRef.current!.openDrawer(handleSubmit, null)
    } else if (actionType === 'addSubMenu') {
      parentMenuInfo.current = editItem
      drawerRef.current!.openDrawer(handleSubmit, null)
    } else if (actionType === 'editMenu') {
      parentMenuInfo.current = null
      drawerRef.current!.openDrawer(handleSubmit, editItem)
    }
  }

  const handleRemove = (menu: MenuData) => {
    const { openModal, closeModal } = modalRef.current!

    openModal('确定要删除该菜单(删除后子菜单不会保留)', () => {
      const removeIds = getRemoveMenuIds(menu)
      removeMenu(removeIds)
        .then(res => {
          const { code } = res.data
          // 删除成功
          if (code === 200) {
            message.success('删除成功')
            toggleRefreshFlag(f => !f)
            closeModal()
          }
        })
        .catch(err => {
          closeModal()
        })
    })
  }

  const handleSubmit = (result: FormResult, editData: RecordData | null) => {
    function afterSuccess(msg: string) {
      message.success(msg)

      toggleRefreshFlag(f => !f)

      drawerRef.current!.closeDrawer()
    }

    if (editData) {
      updateMenu(editData._id, result).then(() => afterSuccess('修改菜单成功'))
    } else {
      const payload: CreateMenuPayload = {
        ...result,
        parentId: undefined,
        topIds: [],
      }

      /** 如果添加子菜单 */
      if (parentMenuInfo.current) {
        const { _id, topIds, auth } = parentMenuInfo.current
        payload.parentId = parentMenuInfo.current._id!
        payload.topIds = [...topIds!, _id!]

        /** 继承夫菜单的 auth 属性 */
        payload.auth = Array.from(new Set(auth!.concat(result.auth)))
      }

      createMenu(payload).then(() => afterSuccess('添加菜单成功'))
    }
  }

  /** 获取表格数据 */
  useEffect(() => {
    setLoading(true)
    fetchMenus<ResponseMenuData>({}).then(res => {
      const { menus } = res.data.data
      const transferResult = arr2menu(menus)
      /** TODO 这里会产生 bug */
      setLoading(false)
      // console.log('transferResult', transferResult)
      setTableData(transferResult)
    })
  }, [refreshFlag])

  const extraButton = (
    <Button
      size="small"
      type="primary"
      ghost
      onClick={() => handleShowDrawer('addMenu', null)}
    >
      添加一级菜单
    </Button>
  )

  return (
    <CommonPanel>
      <Card title="菜单列表管理" className="panel-card" extra={extraButton}>
        <CommonTableWra>
          <Table
            rowKey="_id"
            bordered
            columns={columns}
            size="middle"
            dataSource={tableData}
            loading={isLoading}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 950 }}
          />
        </CommonTableWra>
      </Card>

      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />

      <FormDrawer baseTitle="菜单" fields={fields} ref={drawerRef} />
    </CommonPanel>
  )
})

export default MenuList
