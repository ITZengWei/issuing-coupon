import { useState, ChangeEvent } from 'react'

type UseInputValueReturn = [
  string,
  (val: string) => void,
  (event: ChangeEvent<HTMLInputElement>) => void,
  string,
]

export default function useInputValue(defaultVal: string): UseInputValueReturn {
  const [value, setValue] = useState(defaultVal)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setValue(value)
  }
  const trimVal = value.trim()

  return [value, setValue, handleChange, trimVal]
}
