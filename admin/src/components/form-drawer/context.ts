import { createContext } from 'react'

export interface FormDrawerContextProps {
  /** 关闭模态框标识 */
  closeFlag: boolean
}

export const formDrawerContext = createContext<FormDrawerContextProps>(
  {} as FormDrawerContextProps,
)
