import { memo, FC, useContext } from 'react'
import { TodoAction } from './index'
import TodoContext from './context'

interface TodoFooterProps {
  /** 当前 hash */
  currentActive: 'all' | 'completed' | 'active'
}

/** 待办底部过滤组件 */
const TodoFooter: FC<TodoFooterProps> = memo(props => {
  const { currentActive } = props
  const { todoAction } = useContext(TodoContext)

  return (
    <footer className="footer">
      <ul className="filters">
        <li>
          <a
            className={currentActive === 'all' ? 'selected' : ''}
            href="/#/dashboard/workplace"
          >
            所有
          </a>
        </li>
        <li>
          <a
            href="/#/dashboard/workplace#active"
            className={currentActive === 'active' ? 'selected' : ''}
          >
            待完成
          </a>
        </li>
        <li>
          <a
            href="/#/dashboard/workplace#completed"
            className={currentActive === 'completed' ? 'selected' : ''}
          >
            已完成
          </a>
        </li>
      </ul>
      <button
        className="clear-completed"
        onClick={() => todoAction<TodoAction.clearDone>(TodoAction.clearDone)}
      >
        清除已完成
      </button>
    </footer>
  )
})

export default TodoFooter
