import { FC, memo, useState, useEffect, useMemo } from 'react'
import { Card, Empty, Row, Col, Statistic, Button } from 'antd'
import {
  ReadOutlined,
  ProfileOutlined,
  FileDoneOutlined,
  TagOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { Column, Pie, Line, Bar } from '@ant-design/charts'
import { PieConfig } from '@ant-design/charts/lib/pie'
import { ColumnConfig } from '@ant-design/charts/lib/column'
import { BarConfig } from '@ant-design/charts/lib/bar'
import { TopItem } from './style'
import globalStyle from '../../styles/global-style'
import { IStoreState } from '../../store/types'
import { IUserType } from '../../store/module/user/reducer'
import { useSelector } from 'react-redux'
import {
  fetchTopCardData,
  TopCardResponseData,
  fetchArticleGroupData,
  ArticleGroupResponseData,
  fetchUserArticleData,
  UserArticleResponseData,
} from '../../api/analyse'

// import TweenOne from 'rc-tween-one'
// //@ts-ignore
// import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin'

/** 顶部卡片 */
const TopCard: FC = memo(props => {
  const [isLoading, setLoading] = useState(true)
  const [topData, setTopData] = useState<TopCardResponseData>(
    {} as TopCardResponseData,
  )
  /** 待办比率 */
  const todoRate = useMemo(() => {
    if (!topData.todo) return

    return `${topData.todo.done} / ${topData.todo.total}`
  }, [topData.todo])

  useEffect(() => {
    setLoading(true)
    fetchTopCardData().then(res => {
      const { data } = res.data
      setTopData(data)
      setLoading(false)
    })
  }, [])

  const animation = topData.article
    ? null
    : {
        Children: {
          value: 10000,
          floatLength: 2,
        },
        duration: 1000,
      }

  return (
    <>
      <Col xs={24} md={12} xl={6}>
        <TopItem iconColor={globalStyle['theme-color']}>
          <div className="iconWra">
            <ReadOutlined />
          </div>
          <div className="description">
            {/* <TweenOne animation={{ x: 100 }}>
              {' '}
              <div key="0">demo</div>
            </TweenOne> */}
            <Statistic
              title="文章篇数"
              value={topData.article}
              loading={isLoading}
            />
          </div>
        </TopItem>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <TopItem iconColor="#F4516C">
          <div className="iconWra">
            <ProfileOutlined />
          </div>
          <div className="description">
            <Statistic title="待办项目" value={todoRate} loading={isLoading} />
          </div>
        </TopItem>
      </Col>

      <Col xs={24} md={12} xl={6}>
        <TopItem iconColor="#36A3F7">
          <div className="iconWra">
            <FileDoneOutlined />
          </div>
          <div className="description">
            <Statistic
              title="记录行数"
              value={topData.record}
              loading={isLoading}
            />
          </div>
        </TopItem>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <TopItem iconColor="#40C9C6">
          <div className="iconWra">
            <TagOutlined />
          </div>
          <div className="description">
            <Statistic
              title="书签个数"
              value={topData.bookmark}
              loading={isLoading}
            />
          </div>
        </TopItem>
      </Col>
    </>
  )
})

/** 增长效果 */
const IncrementLine: FC = memo(props => {
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/e00d52f4-2fa6-47ee-a0d7-105dd95bde20.json',
    )
      .then(response => response.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(error => {
        console.log('fetch data failed', error)
      })
  }, [])

  const lineConfig = {
    data: data,
    xField: 'year',
    yField: 'gdp',
    seriesField: 'name',
    yAxis: {
      label: {
        formatter: function formatter(v: any) {
          return ''.concat((v / 1000000000).toFixed(1), ' B')
        },
      },
    },
    legend: { position: 'top' },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1500,
      },
    },
  }
  return (
    <Col span={24}>
      <Card bordered={false} loading={isLoading}>
        <Line {...(lineConfig as any)} />
      </Card>
    </Col>
  )
})

/** 文章组情况 */
const ArticleGroup: FC = memo(props => {
  const [groupData, setGroupData] = useState<ArticleGroupResponseData>({
    column: [],
    pie: [],
  })

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchArticleGroupData().then(res => {
      const { data } = res.data
      setGroupData(data)
      setLoading(false)
    })
  }, [])

  var columnConfig: ColumnConfig = {
    data: groupData.column,
    xField: 'category',
    yField: 'count',
    isStack: true,
    seriesField: 'type',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      category: { alias: '类别' },
      count: { alias: '文章量' },
    },
  }

  const pieConfig: PieConfig = {
    data: groupData.pie,
    appendPadding: 10,
    angleField: 'count',
    colorField: 'category',
    radius: 0.8,
    legend: false,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  }

  /** 如果获取了数据，但是没有文章数据，我们提示用户 */
  if (isLoading === false && groupData.pie.length === 0) {
    return (
      <Col xs={24}>
        <Card title="我的文章分布">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="您还没有文章数据，快去编写文章查看啦~"
          >
            <Button>
              <Link to="/article/add" replace>
                创建文章
              </Link>
            </Button>
          </Empty>
        </Card>
      </Col>
    )
  }

  return (
    <>
      <Col xs={24} md={16}>
        <Card
          title="我的文章分布"
          bodyStyle={{ height: 500 }}
          bordered={false}
          loading={isLoading}
        >
          <Column {...columnConfig} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card
          title="我的文章分布"
          bordered={false}
          bodyStyle={{ height: 500 }}
          loading={isLoading}
        >
          <Pie {...pieConfig} />
        </Card>
      </Col>
    </>
  )
})

/** 用户文章 */
const UserArticle: FC = memo(props => {
  const [userArticleData, setUserArticleData] = useState<
    UserArticleResponseData[]
  >([])

  const [isLoading, setLoading] = useState(false)

  const config: BarConfig = {
    data: userArticleData,
    xField: 'total',
    yField: 'account',
    // yAxis: {
    //   label: {
    //     formatter(v: any) {
    //       console.log(v)
    //       return 'xxx'
    //     },
    //   },
    // },
    seriesField: 'account',
    legend: false,
    meta: {
      type: { alias: '用户账号' },
      total: { alias: '发布文章数' },
    },
  }

  useEffect(() => {
    setLoading(true)
    fetchUserArticleData().then(res => {
      const { data } = res.data
      setUserArticleData(data)
      setLoading(false)
    })
  }, [])

  return (
    <Col span={24}>
      <Card bordered={false} title="用户文章发表概览" loading={isLoading}>
        <Bar {...config} />
      </Card>
    </Col>
  )
})

const Analyses: FC = memo((props: any) => {
  const role = useSelector<IStoreState, IUserType>(state => state.user.role)

  return (
    <div>
      <Row gutter={[16, 16]}>
        <TopCard />
        <ArticleGroup />
        <IncrementLine />
        {role === IUserType.superAdmin && <UserArticle />}
      </Row>
    </div>
  )
})
export default Analyses
