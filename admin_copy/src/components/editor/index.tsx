import {
  memo,
  FC,
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import Simplemde from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import { SimpEditorWra } from './style'

interface InnerResult {
  html: string
  text: string
}

/** markdown 文本转换为 html */
export function markdownToHTML(simpleInstance: any, text: string): string {
  try {
    return simpleInstance?.markdown(text)
  } catch {
    return text
  }
}

// console.dir(markdownToHTML)

/** 向外抛出的对象 */
export interface EditorImperativeProps {
  /** 编辑器对象 */
  editor: Simplemde

  /** 获取编辑器内容 */
  getEditorInner: () => InnerResult

  /** 设置编辑器内容 */
  setEditorInner: (html: string) => void
}

interface SimpEditorProps {
  ref: any
}

const SimpEditor: FC<SimpEditorProps> = memo(
  forwardRef((props, ref) => {
    const [simpEditor, setSimeEditor] = useState<Simplemde | null>(null)

    const simpEditDom = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
      if (simpEditDom.current === null) return

      let simp = new Simplemde({
        element: simpEditDom.current,
        // 拼写检查
        spellChecker: false,
        // 禁止下载在线 font-awesome
        autoDownloadFontAwesome: false,
      })

      setSimeEditor(simp)
    }, [])

    /** 将操作富文本的对象抛出 */
    useImperativeHandle<any, EditorImperativeProps | null>(ref, () => {
      if (simpEditor === null) return null

      return {
        editor: simpEditor,
        getEditorInner() {
          let value = simpEditor.value()

          return {
            html: markdownToHTML(simpEditor, value),
            text: value,
          }
        },
        setEditorInner: (html: string) => {
          simpEditor.value(html)
        },
      }
    })

    return (
      <SimpEditorWra>
        <textarea ref={simpEditDom} className="inner" />
      </SimpEditorWra>
    )
  }),
)

export default SimpEditor
