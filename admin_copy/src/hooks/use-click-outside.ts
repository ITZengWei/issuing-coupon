import { useEffect, RefObject } from 'react'

export default function useClickOutSide(
  wrapperRef: RefObject<HTMLElement>,
  handler: Function,
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // 如果 ref 实例没有初始化完成，或者 没有处理函数 直接退出
      if (!wrapperRef.current || !handler) return

      const target = event.target as HTMLElement

      // 如果在容器内部直接退出
      if (wrapperRef.current.contains(target)) return

      handler(event)
    }

    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('click', listener)
    }
  }, [wrapperRef, handler])
}
