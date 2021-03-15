import {
  memo,
  FC,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  useContext,
} from 'react'
import QueueAnim from 'rc-queue-anim'
import { TodoAction, Todo } from './index'
import TodoContext from './context'
import useDebounce from '../../hooks/useDebounce'

interface TodoItemProps {
  todo: Todo
  isCurrentEdit: boolean
  setCurrentEdit: any
}

const TodoItem: FC<TodoItemProps> = memo(props => {
  const { todoAction } = useContext(TodoContext)

  const {
    todo: { _id, text, completed },
    isCurrentEdit,
    setCurrentEdit,
  } = props

  // 上一次点击的时间
  const lastClickTime = useRef(0)

  // 设置内部 text 提高性能
  const [innerText, setInnerText] = useState(text)

  // 如果父组件里面的 text 改变了我们就重置
  useEffect(() => {
    setInnerText(text)
  }, [text])

  const editInput = useRef<HTMLInputElement>(null)

  const className = []

  if (completed) {
    className.push('completed')
  }

  if (isCurrentEdit) {
    className.push('editing')
  }

  const handleDoubleClick = () => {
    const now = Date.now()
    // 判断当前时间和上一次的间隔是否符合

    if (now - lastClickTime.current < 300) {
      console.log('xxx')
      setCurrentEdit(_id)
    }

    lastClickTime.current = now
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { keyCode } = event
    // 如果不是回车直接 返回不做处理
    if (keyCode !== 13) return

    handleBlur()
  }

  const handleEdit = () => {
    const { value } = editInput.current!

    const text = value.trim()
    setInnerText(text)
  }

  // 当我们失去焦点的时候，设置一下修改的内容，并且重置编辑的那一项
  const handleBlur = () => {
    setCurrentEdit(-1)
  }

  const debounceValue = useDebounce<string>(innerText, 1500)

  useEffect(() => {
    if (isCurrentEdit === false) return

    // 如果 innerText 有值代表编辑 没有值我们这里直接删除
    if (debounceValue) {
      todoAction<TodoAction.change>(TodoAction.change, {
        id: _id,
        text: debounceValue,
      })
    } else {
      todoAction<TodoAction.remove>(TodoAction.remove, _id)
    }
  }, [debounceValue])

  useEffect(() => {
    if (!isCurrentEdit || editInput.current === null) return

    // 让 编辑输入框 获得焦点
    editInput.current.focus()

    editInput.current.addEventListener('blur', handleBlur)

    return () => {
      editInput.current!.removeEventListener('blur', handleBlur)
    }
  }, [isCurrentEdit])

  return (
    <li className={className.join(' ')}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={() =>
            todoAction<TodoAction.toggle>(TodoAction.toggle, {
              id: _id,
              completed: !completed,
            })
          }
        />
        <label onClick={() => handleDoubleClick()}>{innerText}</label>
        <button
          className="destroy"
          onClick={() => todoAction<TodoAction.remove>(TodoAction.remove, _id)}
        ></button>
      </div>
      <input
        ref={editInput}
        onChange={() => handleEdit()}
        onKeyDown={handleKeyDown}
        className="edit"
        value={innerText}
      />
    </li>
  )
})

interface TodoListProps {
  todoList: Todo[]
}

/** 待办列表展示组件 */
const TodoList: FC<TodoListProps> = memo(props => {
  const { todoList } = props

  const [currentEditTodoId, setCurrentEditTodoId] = useState<string | null>(
    null,
  )

  return (
    <section className="main">
      <QueueAnim delay={300} className="todo-list">
        {todoList.map(todo => (
          <TodoItem
            key={todo._id}
            isCurrentEdit={currentEditTodoId === todo._id}
            setCurrentEdit={setCurrentEditTodoId}
            todo={todo}
          />
        ))}
      </QueueAnim>
    </section>
  )
})

export default TodoList
