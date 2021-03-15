import { useMemo, useEffect, memo, FC, useState, useCallback } from 'react'
import { Card, Divider } from 'antd'
import { TodoWrapper } from './style'
import useHashChange from '../../hooks/use-hash-change'
import TodoControl from './todo-control'
import TodoList from './todo-list'
import TodoFooter from './todo-footer'
import { Todo } from './index'

interface TodoAppProps {
  /** 待办列表 */
  todoList: Todo[]
}

/** 待办应用 */
const TodoApp: FC<TodoAppProps> = memo(props => {
  const { todoList } = props
  const hash = useHashChange()

  const currentActive: 'all' | 'completed' | 'active' = useMemo(() => {
    const currentHash = hash.replace('dashboard/workplace', '')
    if (currentHash === '#active') {
      return 'active'
    } else if (currentHash === '#completed') {
      return 'completed'
    } else {
      return 'all'
    }
  }, [hash])

  const isCompletedAll = useMemo(() => {
    // 查看是否为全部完成
    return todoList.every(todo => todo.completed)
  }, [todoList])

  const filterTodos = useMemo(() => {
    // 查看是否为全部完成
    return todoList.filter(todo => {
      if (currentActive === 'all') {
        return true
      } else if (currentActive === 'active') {
        return todo.completed === false
      } else {
        return todo.completed === true
      }
    })
  }, [todoList, currentActive])

  return (
    <TodoWrapper>
      <section className="todoapp">
        {/* 添加待办控制组件 */}
        <TodoControl
          todoLen={todoList.length}
          isCompletedAll={isCompletedAll}
        />
        {/* 待办列表展示组件 */}
        <TodoList todoList={filterTodos} />
        {/* 待办底部过滤组件 */}
        <TodoFooter currentActive={currentActive} />
      </section>
    </TodoWrapper>
  )
})

export default TodoApp
