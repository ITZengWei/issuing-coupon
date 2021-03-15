import { createContext } from 'react'
import { TodoActionFunc } from './index'

export interface TodoContextProps {
  /** 待办操作行为 */
  todoAction: TodoActionFunc
}

const TodoContext = createContext<TodoContextProps>({} as TodoContextProps)

export default TodoContext
