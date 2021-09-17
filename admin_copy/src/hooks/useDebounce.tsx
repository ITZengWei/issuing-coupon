import { useState, useEffect } from 'react'

export default function useDebounce<T = any>(value: T, delay: number = 300): T {
  const [debounceValue, setDebounceValue] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounceValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debounceValue
}
