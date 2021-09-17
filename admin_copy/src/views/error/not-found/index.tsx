import { FC } from 'react'
import { Empty, Button } from 'antd'
import { Link } from 'react-router-dom'

const NotFound: FC = (props: any) => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_DEFAULT}
      description="not found 404 您搜索的页面不存在"
    >
      <Button>
        <Link to="/" replace>
          返回首页
        </Link>
      </Button>
    </Empty>
  )
}

export default NotFound
