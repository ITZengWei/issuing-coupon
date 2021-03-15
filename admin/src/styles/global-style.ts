// 扩展点击范围
const extendClick = () => {
  return `
    position: relative;
    &:before{
      content: '';
      position: absolute;
      top: -10px; bottom: -10px; left: -10px; right: -10px;
    };
  `
}

// 文本溢出省略号
const noWrap = () => {
  return `
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `
}

// 文本一处省略号(行数)
const noWrapWithLine = (line: number) => {
  return `
  	display: -webkit-box; /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示  */
    -webkit-line-clamp: ${line};  /* 用来限制在一个块元素显示的文本的行数 */
    -webkit-box-orient: vertical;  /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式  */
    overflow: hidden;
  `
}

// 背景铺满全屏
const bgFull = () => {
  return `
    background-position: 50%;
    background-size: contain;
    background-repeat: no-repeat;
  `
}

/** 滚动条修饰 */
const scrollDecorator = (height: number, width?: number) => {
  return `
  &::-webkit-scrollbar {
    width: ${width ?? 8}px;
    height: ${height}px;
  }
  &::-webkit-scrollbar-thumb {

    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #999;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }
  `
}

const globalStyle = {
  /** 主题颜色 */
  'theme-color': '#f9c700',
  /** 主题阴影 */
  'theme-color-shadow': 'rgba(249, 199, 0, .5)',
  /** 文本高亮颜色 */
  'font-color-light': '#f1f1f1',
  /** 文本高光阴影 */
  'font-color-light-shadow': 'rgba(241, 241, 241, 0.6)',
  /** 描述颜色 */
  'font-color-desc': '#2E3030',
  /** 描述颜色版本二 */
  'font-color-desc-v2': '#bba8a8',
  /** 字体超小 */
  'font-size-ss': '10px',
  /** 字体小 */
  'font-size-s': '12px',
  /** 字体中 */
  'font-size-m': '14px',
  /** 字体大 */
  'font-size-l': '16px',
  /** 字体超大 */
  'font-size-ll': '18px',
  /** 边框颜色 */
  'border-color': '#e4e4e4',
  /** 边框颜色版本二 */
  'border-color-v2': 'rgba(228, 228, 228, 0.1)',
  /** 主背景颜色 */
  'background-color': '#D7D7D7',
  'background-color-shadow': 'rgba(0, 0, 0, 0.3)',
  /** 高亮背景颜色 */
  'highlight-background-color': '#fff',
  /** 官方红 */
  'official-red': '#E82001',
  extendClick,
  noWrap,
  noWrapWithLine,
  bgFull,
  scrollDecorator,
}

export default globalStyle
