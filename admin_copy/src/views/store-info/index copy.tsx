import { FC, memo, useState } from 'react'
import { Steps, Card, Form, Input, Button, Row, Col, Result } from 'antd'
import {
  UserOutlined,
  SolutionOutlined,
  PropertySafetyOutlined,
} from '@ant-design/icons'
import { CommonPanel } from '../analyses/style'
import { ContentWrapper } from './style'

const { Step } = Steps

interface formResult {
  name: string
}

/** 用户信息表单 */
const UserInfoForm: FC = memo(props => {
  const [form] = Form.useForm()

  const handleSubmit = (result: formResult) => {
    const { name } = result

    function afterSuccess(msg: string) {}
  }

  return (
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
            label="手机"
            name="phone"
            rules={[{ required: true, message: '手机号不能为空!' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
})

/** 商铺信息表单 */
const StoreInfoForm: FC = memo(props => {
  const [form] = Form.useForm()

  const handleSubmit = (result: formResult) => {
    const { name } = result

    function afterSuccess(msg: string) {}
  }

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={18}>
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
            name="logoImg"
            rules={[{ required: true, message: '店铺LOGO不能为空!' }]}
          >
            <Input placeholder="请输入店铺LOGO" />
          </Form.Item>
        </Col>

        <Col xs={24} xl={12} xxl={8}>
          <Form.Item
            label="营业执照"
            name="license"
            rules={[{ required: true, message: '营业执照不能为空!' }]}
          >
            <Input placeholder="请输入营业执照" />
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
    </Form>
  )
})

/** 商铺审核状态 */
const StoreStatus: FC = memo(props => {
  return (
    <Result status="success" title="审核成功" subTitle="店铺信息审核审核成功" />
  )
})

const StoreInfo: FC = memo((props: any) => {
  const [currentStep, setCurrentStep] = useState<number>(0)

  const renderContent = () => {
    if (currentStep === 0) {
      return <UserInfoForm />
    } else if (currentStep === 1) {
      return <StoreInfoForm />
    } else if (currentStep === 2) {
      return <StoreStatus />
    }
  }

  return (
    <CommonPanel>
      <Card title="完善商家信息" className="panel-card">
        <Steps
          current={currentStep}
          onChange={current => setCurrentStep(current)}
        >
          <Step title="用户信息" icon={<UserOutlined />} />
          <Step title="商铺信息" icon={<SolutionOutlined />} />
          <Step title="审核状态" icon={<PropertySafetyOutlined />} />
        </Steps>
      </Card>

      <ContentWrapper>
        {renderContent()}
        <div className="step-action">
          <div>
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(c => c - 1)}>上一步</Button>
            )}
          </div>
          <div>
            {currentStep < 2 && (
              <Button onClick={() => setCurrentStep(c => c + 1)}>下一步</Button>
            )}
          </div>
        </div>
      </ContentWrapper>
    </CommonPanel>
  )
})

export default StoreInfo
