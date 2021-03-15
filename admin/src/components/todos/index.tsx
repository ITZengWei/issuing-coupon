import {
  useMemo,
  useEffect,
  memo,
  FC,
  useState,
  useCallback,
  useRef,
} from 'react'
import { Row, Col, message } from 'antd'
import TodoCompleteRate from './todo-rate'
import TodoDynamic from './todo-dynamic'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import TodoContext, { TodoContextProps } from './context'
import TodoApp from './todo-app'
import { TodoDynamicData } from './todo-dynamic'

import {
  addTodo,
  removeTodo,
  changeTodo,
  toggleTodo,
  clearCompletedTodo,
  fetchTodos,
  fetchTodoProcess,
  undoTodoDynamic,
  clearAllDynamic,
  fetchTodoDynamic,
  toggleAllTodo,
} from '../../api/todo'

/** 待办行为 */
export enum TodoAction {
  /** 新增待办 */
  add = 'add',

  /** 新增待办 */
  remove = 'remove',

  /** 修改待办(文案) */
  change = 'change',

  /** 切换待办完成状态 */
  toggle = 'toggle',

  /** 切换所有待办完成状态 */
  toggleAll = 'toggleAll',

  /** 清除完成的待办 */
  clearDone = 'clearDone',

  /** 撤销 */
  undo = 'undo',

  /** 获取待办 */
  find = 'find',
}

type Key<U> = U extends TodoAction.add
  ? 'add'
  : U extends TodoAction.remove
  ? 'remove'
  : U extends TodoAction.change
  ? 'change'
  : U extends TodoAction.toggle
  ? 'toggle'
  : U extends TodoAction.toggleAll
  ? 'toggleAll'
  : U extends TodoAction.clearDone
  ? 'clearDone'
  : U extends TodoAction.undo
  ? 'undo'
  : 'other'

type ActionNoPayload = TodoAction.clearDone | TodoAction.find

type ActionWithPayload = Exclude<TodoAction, ActionNoPayload>

export type Payload<U> = {
  /** 待办文案 */
  add: string
  /** 删除待办的Id */
  remove: string
  /** { id: 待办Id, text: 修改的文案 } */
  change: { id: string; text: string }
  /** 切换待办的Id */
  toggle: { id: string; completed: boolean }
  /** 切换所有完成状态 */
  toggleAll: boolean
  /** 清除完成的待办 */
  clearDone: any
  /** 撤销 => 待办 Id */
  undo: string
  other: any
}[Key<U>]

/** 待办操作行为方法 */
export interface TodoActionFunc {
  /** 没有payload的action */
  <T extends ActionNoPayload>(actionType: ActionNoPayload): void | never

  /** 没有payload的action */
  <T extends ActionWithPayload>(
    actionType: ActionWithPayload,
    payload: Payload<T>,
  ): void | never

  /** 用于包含上面所有的类型 */
  <T extends TodoAction>(actionType: TodoAction, payload?: Payload<T>):
    | void
    | never
}

/** 待办 */
export type Todo = {
  _id: string

  /** 待办文案 */
  text: string

  /** 是否完成 */
  completed: boolean
}

const Todos: FC = memo(() => {
  /** 待办列表 */
  const [todoList, setTodoList] = useState<Todo[]>([])

  /** 待办动态列表 */
  const [todoDynamics, setTodoDynamics] = useState<TodoDynamicData[]>([])

  /** 待办完成进度 */
  const [todoProcess, setProcess] = useState(0)

  /** 获取表格数据加载状态 */
  const [isLoading, setLoading] = useState(false)

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)

  /** 待办行为 */
  const todoAction = useMemo<TodoActionFunc>(() => {
    /** 没有payload的action */
    function handler<T extends ActionNoPayload>(actionType: T): void | never
    /** 没有payload的action */
    function handler<T extends ActionWithPayload>(
      actionType: T,
      payload: Payload<T>,
    ): void | never
    /** 用于包含上面所有的类型 */
    function handler<T extends TodoAction>(
      actionType: T,
      payload?: Payload<T>,
    ): void | never {
      // console.log('actionType', actionType)
      // console.log('payload', payload)
      const promise = new Promise(resolve => {
        switch (actionType) {
          case TodoAction.add:
            resolve(addTodo(payload as Payload<TodoAction.add>))
            break
          case TodoAction.remove:
            resolve(removeTodo(payload as Payload<TodoAction.remove>))
            break
          case TodoAction.change:
            const { id: changeId, text } = payload as Payload<TodoAction.change>
            resolve(changeTodo(changeId, text))
            break
          case TodoAction.toggle:
            const {
              id: toggleId,
              completed,
            } = payload as Payload<TodoAction.toggle>
            resolve(toggleTodo(toggleId, completed))
            break
          case TodoAction.toggleAll:
            resolve(toggleAllTodo(payload as Payload<TodoAction.toggleAll>))
            break
          case TodoAction.clearDone:
            resolve(clearCompletedTodo())
            break

          case TodoAction.undo:
            resolve(undoTodoDynamic(payload as Payload<TodoAction.undo>))
            break
          default:
            throw new Error('no action type with' + actionType)
        }
      })

      promise.then(() => {
        toggleRefreshFlag(t => !t)
      })
    }

    return handler
  }, [])

  const handleClearAll = useCallback(() => {
    const { openModal, closeModal } = modalRef.current!

    openModal('是否删除所有的待办动态，删除后之前的无法找回~', () => {
      clearAllDynamic()
        .then(res => {
          const { code, msg } = res.data
          // 删除成功
          if (code === 200) {
            setTodoDynamics([])
            message.success(msg)
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(() => closeModal())
    })
  }, [])

  /** 获取数据 */
  useEffect(() => {
    setLoading(true)

    Promise.all([
      fetchTodos<Todo[]>(),
      fetchTodoDynamic<TodoDynamicData[]>(),
      fetchTodoProcess<number>(),
    ]).then(([todoRes, dynamicRes, processRes]) => {
      const { data: todoData } = todoRes.data
      const { data: dynamicData } = dynamicRes.data
      const { data: processData } = processRes.data
      setTodoDynamics(dynamicData)
      // console.log(dynamicData)
      setTodoList(todoData)
      setProcess(processData)
      setLoading(false)
    })

    // fetchTodos<Todo[]>().then(res => {
    //   const { data } = res.data
    //   setLoading(false)
    //   setTodoList(data)
    // })
  }, [refreshFlag])

  return (
    <TodoContext.Provider value={{ todoAction }}>
      <Row gutter={[16, 24]}>
        <Col xs={24} md={16}>
          <TodoApp todoList={todoList} />
        </Col>

        <Col xs={24} md={8}>
          <TodoCompleteRate percent={todoProcess} />
          <TodoDynamic dynamics={todoDynamics} clearAll={handleClearAll} />
        </Col>

        {/* 公共弹框 */}
        <CommonModal ref={modalRef} />
      </Row>
    </TodoContext.Provider>
  )
})

export default Todos
