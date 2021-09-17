import {
  FC,
  memo,
  ReactNode,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
import { Button, message, Modal } from 'antd'

/** 向外抛出的对象 */
export interface ImperativeProps {
  /** 打开弹出框，并且设置内容 */
  openModal: (content: ReactNode, submit: () => void) => void

  /** 关闭弹出框 */
  closeModal: () => void
}

interface CommonModalProps {
  ref: any

  title?: string

  defaultContent?: ReactNode

  /** 自定义底部内容 */
  customFooter?: ReactNode
}

const CommonModal: FC<CommonModalProps> = forwardRef((props, ref) => {
  const { title, defaultContent } = props
  const [isShow, setShow] = useState(false)

  const [isLoading, setLoading] = useState(false)

  const [content, setContent] = useState(defaultContent)

  /** 点击提交之后 */
  const submitAfter = useRef(() => {})

  const handleCancel = () => {
    if (isLoading) {
      return message.warning('正在进行操作,清稍后~')
    }
    setShow(false)
  }

  const handleOk = () => {
    setLoading(true)
    submitAfter.current()
  }

  const customFooter = (
    <>
      <Button key="back" onClick={handleCancel} disabled={isLoading}>
        取消
      </Button>
      ,
      <Button
        key="submit"
        type="primary"
        loading={isLoading}
        onClick={handleOk}
      >
        确认
      </Button>
    </>
  )

  /** 向外抛出设置组件内部的方法 */
  useImperativeHandle<any, ImperativeProps>(ref, () => ({
    openModal: (content, submit) => {
      setShow(true)

      submitAfter.current = submit

      setContent(content)
    },
    closeModal() {
      setLoading(false)
      setShow(false)
    },
  }))

  return (
    <Modal
      visible={isShow}
      title={title || '温馨提示'}
      footer={customFooter}
      onCancel={handleCancel}
    >
      {defaultContent || content}
    </Modal>
  )
})

export default memo(CommonModal)
