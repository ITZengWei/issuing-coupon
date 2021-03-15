import { FC, useEffect, useState, ChangeEvent, useRef } from 'react'
import { Card, Row, Col, Form, Input, Select, Button, message } from 'antd'
import { RouteConfigComponentProps } from 'react-router-config'
import { CommonPanel } from '../analyses/style'
import { IRoute } from '../../routes/types'
import useInputValue from '../../hooks/use-input-value'
import {
  fetchArticleDesc,
  addArticle,
  AddArticleParams,
  editArticle,
} from '../../api/article'
import { fetchTags } from '../../api/tag'
import { fetchCategories } from '../../api/category'

import SimpleUpload from '../../components/simple-upload'
import SimpEditor, { EditorImperativeProps } from '../../components/editor'
import config from '../../config'
import { combineURL } from '../../utils/tool'
import { handleValidatorFields } from '../../utils/validator'
import { CategoryData } from '../category-admin'
const { Option } = Select

/** 文章发布状态 */
export enum ArticleStatus {
  /** 已发布 */
  published = '1',

  /** 草稿 */
  draft = '0',
}

export interface TagData {
  _id: string
  name: string
}

export interface ArticleData {
  author: string
  category: CategoryData
  completed: boolean
  contentHTML: string
  contentMD: string
  createdAt: string
  status: ArticleStatus
  summary: string
  tags: TagData[]
  title: string
  traitImg: string
  _id: string
}

const AddArticle: FC = (props: any) => {
  const { match, route, history } = props as RouteConfigComponentProps

  const [editId, setEditId] = useState<null | string>(null)

  const [editArticleData, setEditArticle] = useState<null | ArticleData>(null)

  /** 所有分类 */
  const [categories, setCategories] = useState<CategoryData[]>([])

  /** 所有标签 */
  const [allTags, setAllTags] = useState<TagData[]>([])

  /** 文章标题 */
  const [title, setTitle, handleTitleChange] = useInputValue('')

  /** 文章作者 */
  const [author, setAuthor, handleAuthorChange] = useInputValue('')

  /** 文章总结 */
  const [summary, setSummary, handleSummaryChange] = useInputValue('')

  /** 文章特色图片，存储图标地址 */
  const [traitImg, setTraitImg] = useState('')

  /** 文章分类，存放分类id */
  const [category, setCategory] = useState('')

  /** 文章标签，存放标签id集合 */
  const [tags, setTags] = useState<string[]>([])

  /** 完成状态 */
  const [completed, setCompleted] = useState<'true' | 'false'>('true')

  /** 编辑器 */
  const editorRef = useRef<EditorImperativeProps>(null)

  useEffect(() => {
    const { id } = match.params as any
    id && setEditId(id)
  })

  /** 获取分类 / 标签数据数据 */
  useEffect(() => {
    // fetchCategories<CategoryData[]>().then(res => {
    //   const { data } = res.data
    //   setCategories(data)
    // })fetchTags
    Promise.all([
      fetchCategories<CategoryData[]>(),
      fetchTags<TagData[]>(),
    ]).then(([categoriesRes, tagRes]) => {
      setCategories(categoriesRes.data.data)
      setAllTags(tagRes.data.data)
    })
  }, [])

  useEffect(() => {
    if (editId === null) return
    /** 获取编辑文章数据的 */
    fetchArticleDesc<ArticleData>(editId).then(res => {
      const { data } = res.data
      setEditArticle(data)
    })
  }, [editId])

  useEffect(() => {
    if (editArticleData === null) return
    /** 重新赋值 */
    setTitle(editArticleData.title)
    setAuthor(editArticleData.author)
    setSummary(editArticleData.summary)
    setTraitImg(editArticleData.traitImg)
    setCategory(editArticleData.category._id)
    setTags(editArticleData.tags.map(tag => tag._id))
    setCompleted(String(editArticleData.completed) as 'true' | 'false')
    setTraitImg(editArticleData.traitImg)
    editorRef.current?.setEditorInner(editArticleData.contentMD)
  }, [editArticleData, editorRef.current])

  /** 处理提交 */
  const handleSubmit = () => {
    const { html, text } = editorRef.current!.getEditorInner()

    /** 验证字段 */
    const validatorResult = handleValidatorFields([
      { value: title, msg: '请先填入文章标题' },
      { value: text || html, msg: '请先填入文章内容' },
      { value: summary, msg: '请先填入文章总结' },
      { value: author, msg: '请先填入文章作者' },
      { value: category, msg: '请先选择文章分类' },
    ])
    if (validatorResult === false) return

    const formParams: AddArticleParams = {
      completed: completed === 'true',
      title,
      author,
      summary,
      contentHTML: html,
      contentMD: text,
      category,
      tags,
      traitImg,
    }

    if (editId) {
      editArticle(editId, formParams).then(res => {
        const { msg } = res.data
        message.success(msg)
        // history.push(combineURL(config.BASENAME, '/article/list'))
        history.replace(combineURL(config.BASENAME, '/article/list'))
      })
    } else {
      addArticle(formParams).then(res => {
        const { msg } = res.data
        message.success(msg)
        history.push(combineURL(config.BASENAME, '/article/list'))
      })
    }
  }

  const renderHeaderTitle = () => {
    const { meta } = route as IRoute

    return <span style={{ fontSize: '24px' }}>{meta.title}</span>
  }

  return (
    <CommonPanel customPadding>
      <Card title={renderHeaderTitle()} bordered={false}>
        <Form layout="vertical">
          <Row justify="space-between">
            <Col xs={24} xl={18}>
              <Form.Item label="文章标题">
                <Input
                  size="large"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="请输入标题"
                />
              </Form.Item>

              <Form.Item label="文章主体">
                <SimpEditor ref={editorRef} />
              </Form.Item>

              <Form.Item label="文章总结">
                <Input
                  size="large"
                  value={summary}
                  onChange={handleSummaryChange}
                  placeholder="请输入文章总结"
                />
              </Form.Item>
            </Col>
            <Col xs={24} xl={{ span: 5, offset: 1 }}>
              <Form.Item label="作者">
                <Input
                  placeholder="请输入作者"
                  value={author}
                  onChange={handleAuthorChange}
                />
              </Form.Item>

              <Form.Item label="特色图片">
                <SimpleUpload filepath={traitImg} setFilePath={setTraitImg} />
              </Form.Item>

              <Form.Item label="分类">
                <Select
                  value={category}
                  onChange={setCategory}
                  placeholder="请选择分类"
                >
                  {categories.map(option => (
                    <Option key={option._id} value={option._id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="标签">
                <Select
                  value={tags}
                  onChange={setTags}
                  mode="tags"
                  placeholder="请选择标签"
                >
                  {allTags.map(option => (
                    <Option key={option._id} value={option._id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="完成状态">
                <Select
                  value={completed}
                  onChange={setCompleted}
                  placeholder="请选择状态"
                >
                  <Option value={'true'}>发布</Option>
                  <Option value={'false'}>草稿</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleSubmit}>
                  {editId ? '保存' : '发表'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </CommonPanel>
  )
}

export default AddArticle
