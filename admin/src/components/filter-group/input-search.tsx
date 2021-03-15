import { FC, memo, useState } from 'react'
import { Input } from 'antd'

export interface FilterInputSearchProps {
  className?: string

  placeholder: string

  onPress: (value: string) => void
}

const FilterInputSearch: FC<FilterInputSearchProps> = memo(props => {
  const { className, placeholder, onPress } = props
  const [value, setValue] = useState('')

  const handleSearchInputChange = (e: any) => {
    const inputValue = e.target
    setValue(inputValue.value)
  }

  const handleSearch = () => {
    onPress(value.trim())
  }

  return (
    <Input.Search
      className={className}
      enterButton
      placeholder={placeholder}
      value={value}
      style={{ width: 280 }}
      onChange={handleSearchInputChange}
      onPressEnter={handleSearch}
      onClick={handleSearch}
    />
  )
})

export default FilterInputSearch
