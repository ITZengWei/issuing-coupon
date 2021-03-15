import { FC, memo } from 'react'
import Todos from '../../components/todos'

const Workplace: FC = memo((props: any) => {
  return (
    <div>
      {/* 待办  */}
      <Todos />
    </div>
  )
})

export default Workplace
