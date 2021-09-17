import styled from 'styled-components'
import globalStyle from '../../styles/global-style'

export const SimpEditorWra = styled.div`
  .inner {
    display: none;
  }
  /** 滚动条 */
  .CodeMirror-vscrollbar {
    display: none !important;
    /* ${globalStyle.scrollDecorator(3)} */
  }
  .CodeMirror-sizer {
    padding-right: 0 !important;
    margin-right: 0 !important;
  }
`
