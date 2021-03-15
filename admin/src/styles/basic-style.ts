import { createGlobalStyle } from 'styled-components'
// import 'ease-develop/dist/index.css'

const BasicStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  html, body{
    background: #f2f3f4;;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  a{
    text-decoration: none;
    color: #fff;
  }
  
  html::-webkit-scrollbar {
    width: 8px;
    height: 1px;
  }
  html::-webkit-scrollbar-thumb {

    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #999;
  }

  html::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }

  body{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 16px;
    color: #363636;
    background-color: #fff;
  }

  /** 控制侧边栏显示与隐藏的抽屉 */
  .ctr-aside-drawer {
    .ant-drawer-body {
      padding: 0 !important;
    }
  }

    /** 滚动的 */
  
  /* 滚动组件容器 */
  .scroll-container {
    width: 100%;
    height: 100%;
    overflow: hidden;

    /* 上拉加载组件 */
    .pull-up-loading {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 5px;
      width: 60px;
      height: 60px;
      margin: auto;
      z-index: 100;
    }

    /* 下拉加载组件 */
    .pull-down-loading {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 30px;
      margin: auto;
      z-index: 100;
    }
  }

  /** 拖拽 */
  .row-dragging {
    background: #fafafa;
    border: 1px solid #ccc;
  }

  .row-dragging td {
    padding: 16px;
    visibility: hidden;
  }

  .row-dragging .drag-visible {
    visibility: visible;
  }

`

export default BasicStyle
