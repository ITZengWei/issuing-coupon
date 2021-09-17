import { FC, memo, useState, useCallback, useEffect, useMemo } from 'react'
import { Card, Form, Input, Button, Row, Col, Result, Tag, message } from 'antd'
import { CommonPanel } from '../analyses/style'
import SimpleUpload from '../../components/simple-upload'
import useShallowEqualSelector from '../../hooks/use-shallow-equal-selector'
import { IStoreState } from '../../store/types'
import { IAudit } from '../../store/module/user/reducer'
import { storeUserAuditStatus } from '../account-list'
import { completeStoreUser, fetchUserInfo } from '../../api/user'
import { handleChangeUserInfo } from '../../store/module/user/actionCreators'
import { useDispatch } from 'react-redux'

/** 商户信息表单字段 */
export interface formResult {
  /** 店铺名称 */
  name: string

  /** 店铺名称 */
  storeName: string

  /** 标志 */
  logo: string

  /** 营业执照 */
  license: string

  /** 商户所在市 */
  city: string

  /** 商户所在省 */
  province: string

  /** 商户身份证 */
  idCard: string
}

/** 商铺审核状态 */
const StoreStatus: FC = memo(props => {
  return (
    <Result status="success" title="审核成功" subTitle="店铺信息审核审核成功" />
  )
})

const StoreInfo: FC = memo((props: any) => {
  const [formResult, setFormResult] = useState<formResult>({
    name: '',
    storeName: '',
    logo: '',
    license: '',
    city: '',
    province: '',
    idCard: '',
  })

  // 获取redux中的user
  const userInfo = useShallowEqualSelector((state: IStoreState) => {
    return state.user.userInfo
  })

  /** 审核状态 */
  const [checkStatus, setCheckStatus] = useState<IAudit>(
    userInfo!?.store!?.audit,
  )
  console.log(checkStatus)

  /** 表单引用 */
  const [form] = Form.useForm()

  const changeFormValue = useCallback(
    (name: string, val: string) => {
      console.log(name)
      form.setFieldsValue({ [name]: val })
    },
    [form],
  )

  const dispatch = useDispatch()

  /** 更新表单数据 */
  const handleSubmit = (result: formResult) => {
    const { idCard } = result
    if (!/^[0-9Xx]+$/.test(idCard)) {
      return message.warning('请输入合法的身份证号！！！')
    }

    completeStoreUser(result).then(res => {
      const { code } = res.data
      // 删除成功
      if (code === 200) {
        message.success('更新成功')
        fetchUserInfo().then(response => {
          const res = response.data.data
          dispatch(handleChangeUserInfo(res))
        })
      }
    })
  }

  // 获取商户信息
  useEffect(() => {
    console.log(userInfo)
    if (userInfo) {
      setFormResult({
        ...userInfo.store!,
      })
    }
  }, [userInfo])

  // 初始化商户信息表单数据
  useEffect(() => {
    Object.keys(formResult).forEach(key =>
      form.setFieldsValue({ [key]: (formResult as any)[key] }),
    )
  }, [formResult])

  /** 当前商户状态 */
  const status = useMemo(() => {
    const { color, label } = storeUserAuditStatus[checkStatus!]
    return (
      <div>
        审核状态: <Tag color={color}>{label}</Tag>
      </div>
    )
  }, [checkStatus])

  return (
    <CommonPanel>
      <Card title="完善商家信息" className="panel-card" extra={status}>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Row gutter={18}>
            <Col xs={24} xl={12} xxl={8}>
              <Form.Item
                label="真实姓名"
                name="name"
                rules={[{ required: true, message: '真实姓名不能为空!' }]}
              >
                <Input placeholder="请输入真实姓名" />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12} xxl={8}>
              <Form.Item
                label="身份证"
                name="idCard"
                rules={[{ required: true, message: '身份证不能为空!' }]}
              >
                <Input placeholder="请输入身份证" />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12} xxl={8}>
              <Form.Item
                label="店铺名"
                name="storeName"
                rules={[{ required: true, message: '店铺名不能为空!' }]}
              >
                <Input placeholder="请输入店铺名" />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12} xxl={8}>
              <Form.Item
                label="店铺LOGO"
                name="logo"
                rules={[{ required: true, message: '店铺LOGO不能为空!' }]}
              >
                <SimpleUpload
                  filepath={formResult.logo}
                  setFilePath={changeFormValue.bind(null, 'logo')}
                />
                {/* <Input placeholder="请输入店铺LOGO" /> */}
              </Form.Item>
            </Col>

            <Col xs={24} xl={12} xxl={8}>
              <Form.Item
                label="营业执照"
                name="license"
                rules={[{ required: true, message: '营业执照不能为空!' }]}
              >
                <SimpleUpload
                  filepath={formResult.license}
                  setFilePath={changeFormValue.bind(null, 'license')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12} xxl={8}>
              <Form.Item
                label="商户所在省"
                name="province"
                rules={[{ required: true, message: '商户所在省不能为空!' }]}
              >
                <Input placeholder="请输入商户所在省" />
              </Form.Item>
            </Col>
            <Col xs={24} xl={12} xxl={8}>
              <Form.Item
                label="商户所在市"
                name="city"
                rules={[{ required: true, message: '商户所在市不能为空!' }]}
              >
                <Input placeholder="请输入商户所在市" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={8} push={8} style={{ marginTop: 30 }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </CommonPanel>
  )
})

export default StoreInfo
