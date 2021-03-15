import { memo, FC, KeyboardEvent, useRef, useContext } from 'react'
import { TodoAction } from './index'
import TodoContext from './context'

interface TodoControlProps {
  todoLen: number
  isCompletedAll: boolean
}

/** 待办头部表单录入组件 */
const TodoControl: FC<TodoControlProps> = memo(props => {
  const { todoLen, isCompletedAll } = props
  const { todoAction } = useContext(TodoContext)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (inputRef.current === null) return

    const { keyCode } = event

    if (keyCode !== 13) return

    const text = inputRef.current.value.trim()

    if (!text) return

    todoAction<TodoAction.add>(TodoAction.add, text)

    inputRef.current.value = ''
  }

  const handleToggleAll = () => {
    todoAction<TodoAction.toggleAll>(TodoAction.toggleAll, !isCompletedAll)
  }

  return (
    <header className="header">
      {todoLen !== 0 && (
        <>
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={isCompletedAll}
            onChange={handleToggleAll}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
        </>
      )}

      <input
        ref={inputRef}
        className="new-todo"
        placeholder="What needs to be done?"
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  )
})

export default TodoControl
