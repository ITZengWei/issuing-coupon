import { Url } from 'url'
import request from '../utils/request'

/** 待办模块请求Url集合 */
export enum TodoUrls {
  addTodo = '/todos/add',
  removeTodo = '/todos',
  changeTodo = '/todos/change',
  toggleTodo = '/todos/toggle',
  toggleAllTodo = '/todos/toggleAll',
  clearCompletedTodo = '/todos/clearCompletedTodo',
  fetchTodos = '/todos/find',
  fetchTodoProcess = '/todos/process',
  clearAllDynamic = '/todos/clearAllDynamic',
  undoTodoDynamic = '/todos/undo',
  fetchTodoDynamic = '/todos/dynamic',
}

/** 待办相关接口 */

/** 增加待办 */
export function addTodo<T = any>(text: string) {
  return request<T>({
    url: TodoUrls.addTodo,
    method: 'POST',
    data: { text },
  })
}

/** 删除待办 */
export function removeTodo<T = any>(todoId: string) {
  return request<T>({
    url: `${TodoUrls.removeTodo}/${todoId}`,
    method: 'DELETE',
  })
}

/** 改变待办文案 */
export function changeTodo<T = any>(todoId: string, newText: string) {
  return request<T>({
    url: TodoUrls.changeTodo,
    method: 'PATCH',
    data: { id: todoId, newText },
  })
}

/** 切换待办完成状态 */
export function toggleTodo<T = any>(todoId: string, completed: boolean) {
  return request<T>({
    url: TodoUrls.toggleTodo,
    method: 'PATCH',
    data: { id: todoId, completed },
  })
}

/** 切换所有待办完成状态 */
export function toggleAllTodo<T = any>(completed: boolean) {
  return request<T>({
    url: TodoUrls.toggleAllTodo,
    method: 'PATCH',
    data: { completed },
  })
}

/** 删除已经完成的待办 TODO */
export function clearCompletedTodo<T = any>() {
  return request<T>({
    url: TodoUrls.clearCompletedTodo,
    method: 'POST',
  })
}

/** 获取待办列表  */
export function fetchTodos<T = any>() {
  return request<T>({
    url: TodoUrls.fetchTodos,
    method: 'GET',
  })
}

/** 获取当前待办完成进度 */
export function fetchTodoProcess<T = any>() {
  return request<T>({
    url: TodoUrls.fetchTodoProcess,
    method: 'GET',
  })
}

/** 待办动态相关接口 */

/** 清除用户待办动态 */
export function clearAllDynamic<T = any>() {
  return request<T>({
    url: TodoUrls.clearAllDynamic,
    method: 'POST', // TODO DELETE 怎么不行
  })
}

/** 待办记录撤销 */
export function undoTodoDynamic<T = any>(dynamicId: string) {
  return request<T>({
    url: `${TodoUrls.undoTodoDynamic}/${dynamicId}`,
    method: 'DELETE',
  })
}

/** 获取待办动态列表 */
export function fetchTodoDynamic<T = any>() {
  return request<T>({
    url: TodoUrls.fetchTodoDynamic,
    method: 'GET',
  })
}
