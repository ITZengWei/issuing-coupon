import {
  FC,
  memo,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { Scroll } from 'ease-develop'
import { Tag } from 'antd'
import { MenuContext } from './context'
import { useHistory, useLocation } from 'react-router-dom'
import { getFlattenMenus } from '../../utils/menu'
import globalStyle from '../../styles/global-style'

interface IHistoryState {
  title: string
  path: string
  active: boolean
}

type IHistoryActionTypes = 'add' | 'remove' | 'toggle' | 'other'

/** 参数荷载 */
type Payload = {
  /** 添加——对象数据类型 */
  add: IHistoryState

  /** 根据标题去切换 */
  toggle: string

  /** 根据标题去删除 */
  remove: string

  /** 其他 */
  other: any
}

interface IHistoryAction {
  type: IHistoryActionTypes
  payload: any
}

const defaultHistoryState: IHistoryState[] = [] /* new Array(30).fill({
  title: 'xxxx',
  path: '/',
  active: true,
}) */

type historyReducerType = (
  state: IHistoryState[],
  action: IHistoryAction,
) => IHistoryState[]

const historyReducer: historyReducerType = (state, action) => {
  let { payload, type } = action

  switch (type) {
    /** 通过传标题，删除成员 */
    case 'remove':
      return state.filter(item => item.title !== payload)

    /** 添加成员，检查是否能找到标题 */
    case 'add':
      if (state.find(item => item.title === payload.title)) {
        return state
      }

      /** 取消所有高亮 */
      return [
        ...state.map(item => {
          item.active = false
          return item
        }),
        payload,
      ]

    /** 切换高亮 */
    case 'toggle':
      return state.map(item => {
        if (item.title === payload) {
          item.active = true
        } else {
          item.active = false
        }
        return item
      })

    /** Test */
    case 'other':
      console.log(action)
      return state
    default:
      return state
  }
}

const ContainerHistory: FC = memo(props => {
  const { menus } = useContext(MenuContext)

  const innerDOM = useRef<HTMLDivElement>(null)
  const innerWidth = useRef<number>(1200)

  const [historyState, historyDispatch] = useReducer(
    historyReducer,
    defaultHistoryState,
  )

  function transformDispatch<T extends IHistoryActionTypes>(
    type: T,
    payload: Payload[T],
  ) {
    historyDispatch({ type, payload })
  }

  const location = useLocation()

  const history = useHistory()

  /** 扁平化的菜单数据 */
  const flattenMenus = useMemo(() => getFlattenMenus(menus), [menus])

  useEffect(() => {
    const { pathname } = location
    /** 判断是否编辑文章 */
    if (/^(\/article\/add\/)\w+/.test(pathname)) {
      return transformDispatch('add', {
        title: '编辑文章-' + pathname.slice(-2),
        path: pathname,
        active: true,
      })
    }
    const currentMenu = flattenMenus.find(menu => menu.path === pathname)

    if (!currentMenu) return

    transformDispatch('add', {
      title: currentMenu.title,
      path: currentMenu.path,
      active: true,
    })

    // historyDispatch({
    //   type: 'add',
    //   payload: {
    //     title: currentMenu.title,
    //     path: currentMenu.path,
    //     active: true,
    //   },
    // })
  }, [location.pathname, flattenMenus])

  const handleClose = (item: IHistoryState) => {
    const { active, title } = item

    // historyDispatch({ type: 'remove', payload: title })
    transformDispatch('remove', title)

    /** 如果删除是激活状态，切换高亮删除后的最后一个成员(注意这里的 historyState 还是以前的数据) */
    if (active) {
      const len = historyState.length

      let lastItem = historyState[len - 1]

      if (lastItem.title === title) {
        lastItem = historyState[len - 2]
      }

      handleToggle(lastItem)
    }
  }

  const handleToggle = (item: IHistoryState) => {
    const { active, title, path } = item

    if (active) return

    // historyDispatch({ type: 'toggle', payload: title })
    transformDispatch('toggle', title)

    history.replace(path)
  }

  useLayoutEffect(() => {
    const dom = innerDOM.current

    if (historyState.length === 0 || !dom) return

    const tag = dom.firstElementChild as HTMLElement

    /** tag 自身宽度 + margin */
    const newWidth = historyState.length * (tag!.offsetWidth + 8)
    // console.log(newWidth)
    // TODO 如何设置 dom 宽度
    // dom.offsetWidth = '100'
    // console.dir(dom)
    innerWidth.current = newWidth
  })

  return (
    <div className="routerHistory">
      <Scroll direction="horizontal">
        <div
          className="routerHistory__inner"
          ref={innerDOM}
          style={{ width: innerWidth.current }}
        >
          {historyState.map(item => (
            <Tag
              color={item.active ? globalStyle['theme-color'] : ''}
              key={item.title}
              closable={historyState.length !== 1}
              visible
              onClose={() => handleClose(item)}
              onClick={() => handleToggle(item)}
            >
              {item.title}
            </Tag>
          ))}
        </div>
      </Scroll>
    </div>
  )
})

export default ContainerHistory
