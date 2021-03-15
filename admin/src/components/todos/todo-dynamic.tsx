import { FC, memo, useContext } from 'react'
import { List, Avatar } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { IStoreState } from '../../store/types'
import { DynamicWrapper } from './style'
import defaultAvatar from '../../asserts/images/default.png'
import { TodoAction } from './index'
import TodoContext from './context'
// import QueueAnim from 'rc-queue-anim'
// import { List as VList, AutoSizer } from 'react-virtualized'

/** 待办动态存储数据中的操作类型 */
type DynamicActionType =
  | 'add'
  | 'remove'
  | 'removeAll'
  | 'change'
  | 'toggle'
  | 'toggleAll'
  | 'other'

/** 待办动态存储数据中的荷载 */
type DynamicActionPayload = {
  /** 添加待办 => 待办名称 */
  add: string

  /** 删除待办 => 待办名称 */
  remove: string

  /** 删除所有完成的待办 => 修改待办的Ids */
  removeAll: string[]

  /** 修改待办内容 => { old: 旧的待办; now: 新的待办  } */
  change: { old: string; now: string }

  /** 切换待办完成状态 => { name: 待办名称; completed: 当前待办完成状态  } */
  toggle: { name: string; completed: boolean }

  /** 切换所有待办完成状态 => { ids: 修改待办的Ids; completed: 当前待办完成状态  } */
  toggleAll: { ids: string[]; completed: boolean }

  other: any
}

/** 待办动态 */
export interface TodoDynamicData {
  _id: string

  /** 待办 Id */
  todoId: any

  /** 存储参数 */
  payload: DynamicActionPayload['other']

  /** 待办操作类型 */
  type: DynamicActionType

  /** 创建时间 */
  createdAt: any
}

interface DynamicInfo {
  title: string
  description: string
}

interface DynamicItemProps {
  item: TodoDynamicData

  avatar: string
}

const DynamicItem: FC<DynamicItemProps> = memo(props => {
  const {
    item: { type, payload, createdAt, _id },
    avatar,
  } = props

  const { todoAction } = useContext(TodoContext)

  const info: DynamicInfo = {
    title: 'xxxxxx',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team',
  }

  switch (type) {
    case 'add':
      info.title = '添加待办'
      info.description = `您新增一个待办名称为: ${payload}`
      break
    case 'remove':
      info.title = '移除待办'
      info.description = `您移除一个名称为${payload}的待办`
      break
    case 'removeAll':
      info.title = '移除已完成待办'
      info.description = `您移除${
        (payload as DynamicActionPayload['removeAll']).length
      }个已经完成的待办项`
      break
    case 'change':
      const { old, now } = payload as DynamicActionPayload['change']
      info.title = '修改待办文案'
      info.description = `您将待办名称为${old}修改文案为${now}`
      break
    case 'toggle':
      const { name, completed } = payload as DynamicActionPayload['toggle']
      info.title = '切换待办完成状态'
      info.description = `您将待办名称为${name}切换为 ${
        completed ? '完成' : '待办'
      }状态`
      break
    case 'toggleAll':
      const {
        ids,
        completed: toggleAllCompleted,
      } = payload as DynamicActionPayload['toggleAll']
      info.title = '切换所有待办完成状态'
      info.description = `您将${ids.length}个待办项切换成${
        toggleAllCompleted ? '完成' : '待办'
      }状态`
      break
    default:
      info.title = '其他待办操作'
      info.description = payload
  }

  // const timeNode = useMemo(() => {
  //   const now = Date.now()

  //   return (
  //     <Tooltip title={dayJs(createdAt).format('YYYY-MM-DD HH:mm:ss')}>
  //       <span>({dayJs(createdAt).format('YY/MM/DD')})</span>
  //     </Tooltip>
  //   )
  // }, [createdAt])

  const titleNode = (
    <div className="dynamic-item-title">
      <div>
        {info.title}
        {/* {timeNode} */}
      </div>

      <span
        className="undo"
        onClick={() => todoAction<TodoAction.undo>(TodoAction.undo, _id)}
      >
        {/* UNDO */}撤销
      </span>
    </div>
  )

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={avatar} />}
        title={titleNode}
        description={info.description}
      />
    </List.Item>
  )
})

interface TodoAppProps {
  /** 待办动态列表 */
  dynamics: TodoDynamicData[]

  /** 清除所有待办动态 */
  clearAll: Function
}

/** 待办动态 */
const Dynamic: FC<TodoAppProps> = memo(props => {
  const { dynamics, clearAll } = props
  /** 用户头像 */
  const userAvatar = useSelector<IStoreState, string>(
    state => state.user.userInfo?.avatar ?? defaultAvatar,
  )

  const header = (
    <div className="dynamic-header">
      待办动态
      {dynamics.length !== 0 && (
        <span className="clear-all" onClick={clearAll as any}>
          <DeleteOutlined /> 清除所有
        </span>
      )}
    </div>
  )

  return (
    <DynamicWrapper>
      <List itemLayout="horizontal" size="small" header={header}>
        {dynamics.map(item => (
          <DynamicItem item={item} key={item._id} avatar={userAvatar} />
        ))}
        {/* <QueueAnim delay={300}>
         
        </QueueAnim> */}
      </List>
    </DynamicWrapper>
  )
})

export default Dynamic
