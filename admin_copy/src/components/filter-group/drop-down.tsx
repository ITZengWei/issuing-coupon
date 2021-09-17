import { FC, memo, useState, useMemo, useEffect } from 'react'
import { Menu, Dropdown } from 'antd'

export interface menuOption<T = any> {
  title: string
  value: T
}

export interface FilterDropDownProps {
  className?: string

  /** 设置当前选中 */
  toggle: (value: string) => void

  /** 菜单列表选项 */
  menuOptions: menuOption[]

  /** 默认选中索引 */
  defaultIndex?: number
}

const FilterDropDown: FC<FilterDropDownProps> = memo(props => {
  const { menuOptions, toggle, defaultIndex, className } = props

  /** 当前选中索引 */
  const [currentIndex, setIndex] = useState(defaultIndex ? defaultIndex : 0)

  /** 当前选中成员 */
  const currenItem = useMemo(() => menuOptions[currentIndex], [currentIndex])

  function handleButtonClick(e: any) {
    /** 索引从0 - len循环即可 */
    const lastIndex = menuOptions.length - 1
    setIndex(index => (index >= lastIndex ? 0 : index + 1))
  }

  function handleMenuClick(e: any) {
    setIndex(Number(e.key))
  }

  /** 监听只要 currentIndex 改变，我们就设置外面的值 */
  useEffect(() => toggle(currenItem.value), [currentIndex])

  const menu = (
    <Menu onClick={handleMenuClick}>
      {menuOptions.map((option, index) => (
        <Menu.Item key={index}>{option.title}</Menu.Item>
      ))}
    </Menu>
  )
  return (
    <Dropdown.Button
      onClick={handleButtonClick}
      overlay={menu}
      className={className}
    >
      <span style={{ minWidth: 80 }}>{currenItem.title}</span>
    </Dropdown.Button>
  )
})

export default FilterDropDown
