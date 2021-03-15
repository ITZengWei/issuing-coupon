import { memo, FC, useState, useEffect, useContext } from 'react'
import { Upload, message, Switch, Input, Image } from 'antd'
import { UploadProps } from 'antd/lib/upload'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { uploadFile2aly } from '../../api/file'
import { formDrawerContext } from '../form-drawer/context'
import { SimpleUploadWrapper } from './style'
import useInputValue from '../../hooks/use-input-value'
import { fallbackImg } from '../../views/album-admin'

/** 阿里云上传文件结果 */
interface AlyUploadResult {
  /** 文件名 */
  filename: string

  /** 图片完整地址 */
  url: string
}

interface SimpleUploadProps {
  /** 图片地址 */
  filepath?: string

  /** 设置图片地址 */
  setFilePath: (url: string) => void
}

const SimpleUpload: FC<SimpleUploadProps> = memo(props => {
  const { filepath, setFilePath } = props

  const [isLoading, setLoading] = useState(false)

  const { closeFlag } = useContext(formDrawerContext)

  const [imageUrl, setImageUrl] = useState<string | undefined>(filepath)

  /** 当前控件是 input 还是 upload */
  const [currentCtrl, setCurrentCtrl] = useState<'input' | 'upload'>('upload')

  /** 文件输入框的值 */
  const [
    inputVal,
    setInputVal,
    handleInputChange,
    trimInputVal,
  ] = useInputValue('')

  useEffect(() => {
    setImageUrl(filepath)
    setInputVal(filepath ?? '')
  }, [filepath])

  /** 监听 drawer关闭的稍后， 设置内容为空 */
  useEffect(() => {
    setImageUrl(undefined)
    setInputVal('')
  }, [closeFlag])

  /** 处理验证文件 */
  function handleValidFile(file: File) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }

    return isJpgOrPng && isLt2M
  }

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    showUploadList: false,
    beforeUpload(file: File) {
      setLoading(true)

      uploadFile2aly<AlyUploadResult>(file).then(res => {
        const { data } = res.data
        const { url } = data
        setImageUrl(url)
        setLoading(false)

        /** 更改外面的值 */
        setFilePath(url)
      })

      return false
    },
  }

  /** 如果输入框的值发生改变 */
  useEffect(() => {
    setFilePath(trimInputVal)
    setImageUrl(trimInputVal)
  }, [trimInputVal])

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  /** 渲染控件 */
  const renderCtrl = () => {
    if (currentCtrl === 'upload') {
      return (
        <Upload {...uploadProps}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              fallback={fallbackImg}
              preview={false}
              style={{ width: '100%' }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      )
    }

    return (
      <Input
        value={inputVal}
        onChange={handleInputChange}
        placeholder="请输入文件地址"
      />
    )
  }

  return (
    <SimpleUploadWrapper>
      {renderCtrl()}

      <Switch
        className="switch"
        checkedChildren="UP"
        unCheckedChildren="IN"
        onChange={isCheck => setCurrentCtrl(isCheck ? 'upload' : 'input')}
        checked={currentCtrl === 'upload'}
      />
    </SimpleUploadWrapper>
  )
})

export default SimpleUpload
