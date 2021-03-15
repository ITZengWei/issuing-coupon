import { FC, memo, useState } from 'react'
import QueueAnim from 'rc-queue-anim'
import { useLocation } from 'react-router'

const TransitionWrapper: FC = props => {
  const [show, setShow] = useState(true)
  const animationConfig = [
    { opacity: [1, 0], translateX: [0, 300] },
    { opacity: [1, 0], translateX: [0, -300] },
  ]
  const { pathname } = useLocation()

  return (
    <QueueAnim
      animConfig={animationConfig}
      type={['right', 'left']}
      ease={['easeOutQuart', 'easeInOutQuart']}
    >
      <button onClick={() => setShow(s => !s)}>toggle</button>
      {show && <div key={pathname}>{props.children}</div>}
    </QueueAnim>
  )
}

export default TransitionWrapper
