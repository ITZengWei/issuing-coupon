import { FC, useState, useEffect, memo, useMemo, useContext } from 'react'
import { Select } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { formDrawerContext } from '../form-drawer/context'

interface FormSelectOptionProps {
  /** 选项名称 */
  name: string

  /** 选项值 */
  value: any

  /** 是否禁用 */
  disable?: boolean
}

interface ISelectProps extends Omit<SelectProps<any>, 'value'> {}

/** 用户使用的菜单属性 */
export interface useFormSelectProps {
  selectProps: ISelectProps
  options: FormSelectOptionProps[]
}

export interface FormSelectProps extends useFormSelectProps {
  /** 选项值 */
  selectedValue?: string

  /** 设置选项值 */
  setSelectedValue: (val: string) => void
}

const FormSelect: FC<FormSelectProps> = memo(props => {
  const { selectProps, options, setSelectedValue, selectedValue } = props

  const [innerValue, setInnerValue] = useState<string | undefined>(
    selectedValue,
  )

  const { closeFlag } = useContext(formDrawerContext)

  /** 监听 drawer关闭的稍后， 设置内容为空 */
  useEffect(() => setInnerValue(undefined), [closeFlag])

  useEffect(() => {
    setInnerValue(selectedValue)
  }, [selectedValue])

  const handleChange = (val: any) => {
    setInnerValue(val)
    setSelectedValue(val)
  }

  const SelectOptions = useMemo(() => {
    return options.map(option => {
      const { name, value, disable } = option
      return (
        <Select.Option key={value} value={value} disable={disable}>
          {name}
        </Select.Option>
      )
    })
  }, [options])

  return (
    <Select {...selectProps} value={innerValue} onChange={handleChange}>
      {SelectOptions}
    </Select>
  )
})

export default FormSelect
