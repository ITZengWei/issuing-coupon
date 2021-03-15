import {
  FC,
  useRef,
  useState,
  useEffect,
  memo,
  useMemo,
  useCallback,
  ReactNode,
  CSSProperties,
} from 'react'
import { Row, Col, Image, Button, message, Skeleton } from 'antd'
import { ColProps } from 'antd/lib/col'
import CommonModal, { ImperativeProps } from '../../components/common-modal'
import {
  PlusOutlined,
  EllipsisOutlined,
  ExportOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import { BookmarkContainer, BookmarkCard, BookmarkColumnWra } from './style'
import { getAntdIconByIconStr } from '../../utils/menu'
import FormDrawer, {
  FormDrawerFieldProps,
  DrawerImperativeProps,
} from '../../components/form-drawer'
import {
  BookmarkData,
  BookmarkColumnData,
  fetchColumnWithMark,
  createBookmarkColumn,
  updateBookmarkColumn,
  createBookmark,
  removeBookmark,
  updateBookmark,
} from '../../api/bookmark'
import useClickOutSide from '../../hooks/use-click-outside'
import { fallbackImg } from '../album-admin'
import { contentToFile } from '../../utils/file'

/** 展示弹框函数 */
interface ShowDrawerFunc {
  (
    type: 'bookmarkColumn' | 'bookmark',
    editItem: any | null,
    bookmarkColumn?: BookmarkColumnData,
  ): void
}

/** 栅格属性 */
const colProps: ColProps = {
  xs: 24,
  sm: 8,
  xl: 6,
  xxl: 4,
}

interface BookmarkItemProps {
  bookmark: BookmarkData
  showDrawer: ShowDrawerFunc
  removeMark: (bookmarkId: string) => void
}

const BookmarkItem: FC<BookmarkItemProps> = memo(props => {
  const { bookmark, showDrawer, removeMark } = props

  const { label, url, cover, _id } = bookmark

  /** 是否展示浮层 */
  const [showLayer, setShowLayer] = useState(false)

  const bookmarkCardRef = useRef<HTMLElement>(null)

  /** 点击其他区域，如果当前蒙层是打开的那么就关闭它 */
  useClickOutSide(bookmarkCardRef, () => {
    if (showLayer) {
      setShowLayer(false)
    }
  })

  return (
    <Col {...colProps}>
      <BookmarkCard ref={bookmarkCardRef}>
        <Image
          className="cover"
          preview={false}
          src={cover}
          alt={label}
          fallback={fallbackImg}
        />
        <p className="label">
          <a href={url} target="_blank">
            {label}
          </a>
        </p>

        {/* 浮层控件 */}
        <EllipsisOutlined
          className="trigger-layer"
          onClick={() => setShowLayer(true)}
        />

        {/* 浮层 */}
        {showLayer && (
          <div className="layer">
            <Button type="primary" danger block onClick={() => removeMark(_id)}>
              删除
            </Button>
            {/* TODO */}
            <Button block onClick={() => showDrawer('bookmark', bookmark)}>
              编辑
            </Button>
          </div>
        )}
      </BookmarkCard>
    </Col>
  )
})

interface BookmarkColumnProps {
  column: BookmarkColumnData
  showDrawer: ShowDrawerFunc
  removeMark: (bookmarkId: string) => void
}

const BookmarkColumn: FC<BookmarkColumnProps> = memo(props => {
  const { column, showDrawer, removeMark } = props

  const { name, bookmarks, icon } = column

  const showDrawerWithColumnData = useCallback<ShowDrawerFunc>(
    (type, editItem) => {
      showDrawer(type, editItem, column)
    },
    [column],
  )

  const iconNode = useMemo(() => getAntdIconByIconStr(icon), [icon])

  return (
    <BookmarkColumnWra>
      <div className="header">
        <div className="column-info">
          <span className="icon">{iconNode}</span>
          <span className="name">{name}</span>
        </div>
        <span onClick={() => showDrawer('bookmarkColumn', column)}>
          编辑书栏
        </span>
      </div>
      <Row gutter={[16, 16]}>
        {bookmarks.map(bookmark => (
          <BookmarkItem
            key={bookmark._id}
            removeMark={removeMark}
            showDrawer={showDrawerWithColumnData}
            bookmark={bookmark}
          />
        ))}

        {/* 添加书签 */}
        <Col
          {...colProps}
          onClick={() => showDrawerWithColumnData('bookmark', null)}
        >
          <BookmarkCard>
            <PlusOutlined className="plus" size={60} />
          </BookmarkCard>
        </Col>
      </Row>
    </BookmarkColumnWra>
  )
})

const BookmarkCollect: FC = memo(() => {
  /** 书签栏目 */
  const [bookmarkColumns, setColumns] = useState<BookmarkColumnData[]>([])

  const [isLoading, setLoading] = useState(false)

  /** 第一次进场动画 */
  const [enterLoading, setEnterLoading] = useState(true)

  /** 弹框展示，数据不更新问题 (原因 useRef更改不会更新视图) */
  const [refBug, setRefBug] = useState(false)

  /** 控制模态框 */
  const modalRef = useRef<ImperativeProps>(null)

  /** 抽屉框 */
  const drawerRef = useRef<DrawerImperativeProps>(null)

  /** 抽屉操作类型 */
  const drawerActionType = useRef<'bookmarkColumn' | 'bookmark'>('bookmark')

  /** 重新获取数据标识 */
  const [refreshFlag, toggleRefreshFlag] = useState(false)

  /** 所属栏目 */
  const belongColumn = useRef<BookmarkColumnData | null>(null)

  /** 表单字段数据 */
  const fields: FormDrawerFieldProps[] = useMemo(() => {
    if (drawerActionType.current === 'bookmarkColumn') {
      return [
        { type: 'input', label: '书栏名称', name: 'name', value: '' },
        { type: 'icon', label: '书栏图标', name: 'icon', value: '' },
      ] as FormDrawerFieldProps[]
    }

    return [
      { type: 'input', label: '书签标题', name: 'label', value: '' },
      {
        type: 'upload',
        label: '书签封面',
        name: 'cover',
        value: '',
        rules: [],
      },
      { type: 'input', label: '书签地址', name: 'url', value: '' },
    ] as FormDrawerFieldProps[]
  }, [drawerActionType.current])

  /** 处理展示抽屉 */
  const handleShowDrawer = useCallback<ShowDrawerFunc>(
    function (type, editItem, bookmarkColumn) {
      /** 改变抽屉表单字段类型 */
      drawerActionType.current = type

      /** 设置所属书栏 */
      belongColumn.current = type === 'bookmark' ? bookmarkColumn! : null

      /** 展示弹框 */
      drawerRef.current!.openDrawer(handleSubmit, editItem)

      setRefBug(f => !f)
    },
    [drawerActionType.current],
  )

  const handleSubmit = (result: any, editData: any | null) => {
    function afterSuccess(msg: string) {
      message.success(msg)

      toggleRefreshFlag(f => !f)

      drawerRef.current!.closeDrawer()
    }

    /** 如果是书栏的添加与编辑，反之书签 */
    if (drawerActionType.current === 'bookmarkColumn') {
      /** 如果是编辑 */
      if (editData) {
        updateBookmarkColumn(editData._id, result).then(res => {
          const { code } = res.data
          if (code === 200) {
            afterSuccess('编辑书栏成功')
          }
        })
      } else {
        createBookmarkColumn(result).then(res => {
          const { code } = res.data
          if (code === 200) {
            afterSuccess('添加书栏成功')
          }
        })
      }
    } else {
      /** 对书签操作，我们拿到所属书栏 */
      const { _id: columnId, bookmarks } = belongColumn.current!

      if (editData) {
        updateBookmark(editData._id, result).then(res => {
          const { code } = res.data
          if (code === 200) {
            afterSuccess('编辑书签成功')
          }
        })
      } else {
        createBookmark({
          column: columnId,
          index: bookmarks.length,
          ...result,
        }).then(res => {
          const { code } = res.data
          if (code === 200) {
            afterSuccess('添加书签成功')
          }
        })
      }
    }
  }

  const handleRemove = useCallback((bookmarkId: string) => {
    const { openModal, closeModal } = modalRef.current!

    openModal('确定要删除该书签吗?', () => {
      removeBookmark(bookmarkId)
        .then(res => {
          const { code } = res.data
          // 删除成功
          if (code === 200) {
            message.success('删除成功')
            toggleRefreshFlag(f => !f)
            closeModal()
          }
        })
        .catch(err => {
          closeModal()
        })
    })
  }, [])

  /** 导入书签 */
  const inputBookmark = () => {
    console.log(message.info('此功能暂未开发~'))
    // contentToFile('bookmark.json', JSON.stringify(bookmarkColumns))
  }

  /** 导出书签 */
  const outputBookmark = () => {
    contentToFile('bookmarks.json', JSON.stringify(bookmarkColumns))
  }

  useEffect(() => {
    setLoading(true)
    fetchColumnWithMark<BookmarkColumnData[]>().then((res: any) => {
      const { data } = res.data
      setColumns(data)
      setLoading(false)

      setEnterLoading(false)
    })
  }, [refreshFlag])

  const renderBookmarkColumns = () => {
    return bookmarkColumns.map(column => (
      <BookmarkColumn
        key={column._id}
        column={column}
        removeMark={handleRemove}
        showDrawer={handleShowDrawer}
      />
    ))
  }

  return (
    <BookmarkContainer>
      {isLoading && enterLoading ? (
        <BookmarkSkeleton />
      ) : (
        renderBookmarkColumns()
      )}

      {/* 底部其他操作 */}
      <div className="button-actions">
        <Button
          className="add-bookmark"
          icon={<EllipsisOutlined />}
          type="primary"
          onClick={() => handleShowDrawer('bookmarkColumn', null)}
        >
          扩展书栏
        </Button>

        <Button
          className="input-bookmark"
          icon={<DownloadOutlined />}
          onClick={inputBookmark}
        >
          导入书签
        </Button>

        <Button
          icon={<ExportOutlined />}
          className="output-bookmark"
          type="primary"
          onClick={outputBookmark}
        >
          导出书签
        </Button>
      </div>

      {/* 公共弹框 */}
      <CommonModal ref={modalRef} />

      {/* 表单抽屉 */}
      <FormDrawer
        baseTitle={
          drawerActionType.current === 'bookmarkColumn' ? '书栏' : '书签'
        }
        fields={fields}
        ref={drawerRef}
      />
    </BookmarkContainer>
  )
})

/** 书签骨架 */
const BookmarkSkeleton: FC = memo(props => {
  /** 渲染占位骨架 */
  function renderSkeleton(row: number, col: number): Array<ReactNode> {
    const inputStyle: CSSProperties = { width: 200, height: 22, marginTop: 10 }

    const ColElement = (
      <Col {...colProps}>
        <BookmarkCard>
          <Skeleton.Avatar active size={66} />
          <Skeleton.Input style={inputStyle} active />
        </BookmarkCard>
      </Col>
    )

    const RowElement = (
      <BookmarkColumnWra>
        <div className="header">
          <div className="column-info">
            <Skeleton.Avatar active size={32} />
            &nbsp;&nbsp;
            <Skeleton.Input style={{ width: 200, height: 28 }} active />
          </div>
          <Skeleton.Button active />
        </div>
        <Row gutter={[16, 16]}>{new Array(col).fill(ColElement)}</Row>
      </BookmarkColumnWra>
    )
    return new Array(row).fill(RowElement)
  }

  return <>{renderSkeleton(2, 8)}</>
})

export default BookmarkCollect
