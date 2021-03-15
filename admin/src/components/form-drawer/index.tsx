import {
  FC,
  useState,
  memo,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  useRef,
  useMemo,
  RefObject,
  useCallback,
} from 'react'
import { Button, Drawer, Form, Input, InputNumber } from 'antd'
import { InputNumberProps } from 'antd/lib/input-number'
import { DrawerProps } from 'antd/lib/drawer'
import { Rule, FormInstance } from 'antd/lib/form'
import SimpleUpload from '../simple-upload'
import FormSelect, { FormSelectProps } from './form-select'
import FormSelectIcon, { FormSelectIconProps } from './form-icon'
import { formDrawerContext, FormDrawerContextProps } from './context'

type FormType = 'input' | 'password' | 'upload' | 'icon' | 'number' | 'select'

export interface FormDrawerFieldProps {
  /** 表单类型 */
  type: FormType

  /** 提示语言 */
  label: string

  /** 表单提交名称 */
  name: string

  /** 表单值 */
  value: string | undefined

  /** 如果是 number 之类的 的一些配置 */
  payload?: any

  rules?: Rule[]
}

/** 向外抛出的对象 */
export interface DrawerImperativeProps {
  /** 打开抽屉，向内传送一个完成后的回调 */
  openDrawer: <T>(afterFinishCb: IAfterFinish, editData: null | T) => void

  /** 关闭抽屉 */
  closeDrawer: () => void
}

interface DrawerFormItemProps {
  form: FormInstance
  field: FormDrawerFieldProps
}

const DrawerFormItem: FC<DrawerFormItemProps> = memo(props => {
  let {
    field: { label, name, type, value, rules, payload },
    form,
  } = props

  if (typeof rules === 'undefined') {
    rules = [{ required: true, message: `${label}不能为空!` }]
  }

  const changeFormValue = useCallback(
    (val: string) => {
      form.setFieldsValue({ [name]: val })
    },
    [form],
  )

  let content: ReactNode = null

  switch (type) {
    case 'password':
      break
    case 'upload':
      form.setFieldsValue({ [name]: value })
      content = <SimpleUpload filepath={value} setFilePath={changeFormValue} />
      break
    case 'icon':
      form.setFieldsValue({ [name]: value })
      content = (
        <FormSelectIcon
          {...(payload as FormSelectIconProps)}
          iconPath={value}
          setIconPath={changeFormValue}
        />
      )
      break
    case 'number':
      content = (
        <InputNumber
          onChange={changeFormValue as any}
          {...(payload as InputNumberProps)}
          style={{ width: '100%' }}
        />
      )
      break
    case 'select':
      form.setFieldsValue({ [name]: value })
      content = payload ? (
        <FormSelect
          {...(payload as FormSelectProps)}
          selectedValue={value}
          setSelectedValue={changeFormValue}
        />
      ) : null
      break
    case 'input':
    default:
      content = <Input placeholder={`请输入${label}`} />
  }

  return (
    <Form.Item label={label} name={name} rules={rules}>
      {content}
    </Form.Item>
  )
})

export interface FormDrawerProps extends DrawerProps {
  /** 根据是否有 editData 拼接标题 */
  baseTitle: string

  ref: RefObject<DrawerImperativeProps>

  /** 字段集合 */
  fields: FormDrawerFieldProps[]
}

interface IAfterFinish {
  (result: any, editData: any): void
}

const FormDrawer: FC<FormDrawerProps> = memo(
  forwardRef((props, ref) => {
    const { fields, baseTitle, ...restProps } = props

    /** 弹框显示状态 */
    const [isShowDrawer, setShowDrawer] = useState(false)

    /** 编辑数据(如果不为空，代表我们是想左编辑操作) */
    const [editData, setEditData] = useState<any>(null)

    /** 关闭 */
    const [closeFlag, setCloseFlag] = useState(false)

    const [form] = Form.useForm()

    /** 完成之后的回调 */
    const afterFinish = useRef<IAfterFinish | null>(null)

    /** 表单执行上下文 */
    const context: FormDrawerContextProps = { closeFlag }

    /** 默认标题 */
    const normalTitle = `${editData ? '编辑' : '添加'}` + baseTitle

    const defaultDrawerProps: DrawerProps = {
      placement: 'right',
    }

    const handleFinish = (result: any) => {
      afterFinish.current && afterFinish.current(result, editData)
    }

    const fieldList = useMemo<FormDrawerFieldProps[]>(() => {
      return fields.map(field => {
        const { name, value } = field
        if (!editData) {
          form.setFieldsValue({ [name]: '' })
          return { ...field, value: '' }
        }
        let editVal = editData[name]

        form.setFieldsValue({ [name]: editVal || value })
        return { ...field, value: editVal }
      })
    }, [closeFlag, editData, fields, form])

    const handleClose = () => {
      setShowDrawer(false)
      setCloseFlag(f => !f)
      setEditData(null)
      afterFinish.current = null
    }

    /** 向外抛出控制抽屉方法 */
    useImperativeHandle<any, DrawerImperativeProps>(ref, () => {
      function openDrawer(afterFinishCb: IAfterFinish, editData: any) {
        /** 将成功后的行为缓存下来 */
        afterFinish.current = afterFinishCb

        setEditData(editData)
        setShowDrawer(true)
      }

      return {
        openDrawer,
        closeDrawer: handleClose,
      }
    })

    return (
      <formDrawerContext.Provider value={context}>
        <Drawer
          title={normalTitle}
          {...Object.assign({}, defaultDrawerProps, restProps)}
          onClose={handleClose}
          visible={isShowDrawer}
          getContainer={false}
        >
          <Form layout="vertical" form={form} onFinish={handleFinish}>
            {fieldList.map(field => (
              <DrawerFormItem form={form} field={field} key={field.name} />
            ))}

            <Form.Item>
              <Button block htmlType="submit" type="primary">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </formDrawerContext.Provider>
    )
  }),
)

export default FormDrawer
