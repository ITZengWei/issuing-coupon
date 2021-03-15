import styled from 'styled-components'
import globalStyle from '../../styles/global-style'

interface TopItemProps {
  iconColor: string
}

/** 顶部卡片项 */
export const TopItem = styled.div<TopItemProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  height: 108px;
  background-color: #fff;
  cursor: pointer;

  .iconWra {
    padding: 15px;
    font-size: 36px;
    color: ${props => props.iconColor};
    margin-right: 3px;
    border-radius: 6px;
    transition: all 0.3s ease;
  }
  &:hover {
    .iconWra {
      background-color: ${props => props.iconColor};
      color: #fff;
    }
  }

  .description {
    /* display: flex; */
    /* flex-direction: column; */
    text-align: right;

    /* .label {
      color: ${globalStyle['font-color-desc']};
      font-size: 18px;
      line-height: 18px;
      font-weight: bold;
      letter-spacing: 3px;
      margin-bottom: 15px;
    } */
  }
`

interface CommonPanelProps {
  className?: string

  /** 是否自定义 padding */
  customPadding?: boolean

  /** 是否自定义 背景颜色 */
  customBg?: boolean
}

/** 公共面板 */
export const CommonPanel = styled.div<CommonPanelProps>`
  padding: ${(props: any) => (props.customPadding ? '' : 24)}px;
  background-color: ${(props: any) => (props.customBg ? '' : '#fff')};
  /* box-shadow: 0 1px 2px 0 ${globalStyle['theme-color-shadow']}; */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-height: 360px;

  .panel-card {
    width: 100%;
    border: none;

    .ant-card-head {
      border-color: ${globalStyle['border-color']};
    }
  }

  @media screen and (max-width: 668px) {
    .panel-card {
      .ant-card-head,
      .ant-card-body {
        padding-right: 0 !important;
        padding-left: 0 !important;
      }
    }
  }
`

/** 公共过滤容器 */
export const CommonFilterWra = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: wrap;
  width: 100%;
  /* overflow-x: scroll; */
  /* ${globalStyle.scrollDecorator(4)}; */
  /* margin-bottom: 20px; */

  .split {
    margin-right: 10px;
  }

  > * {
    margin-bottom: 20px;
  }
`

/** 公共表格盒子 */
export const CommonTableWra = styled.div`
  .ant-table-content {
    ${globalStyle.scrollDecorator(8)};
  }
`
