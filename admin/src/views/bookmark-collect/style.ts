import styled from 'styled-components'
import globalStyle from '../../styles/global-style'

/** 书签容器 */
export const BookmarkContainer = styled.div`
  /** 增加书签 */
  .button-actions {
    /* border-top: 1px solid ${globalStyle['font-color-desc-v2']}; */
    padding: 20px 0;
    margin-top: 50px;
    text-align: center;
    line-height: 24px;
    font-size: 16px;
    color: ${globalStyle['theme-color']};
    /* background-color: #fff; */

    /* > * {
      margin: 0 10px;
    } */
  }
`

/** 书栏列盒子 */
export const BookmarkColumnWra = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    line-height: 24px;

    .column-info {
      color: ${globalStyle['font-color-desc']};
      .icon {
        margin-right: 8px;
      }
    }
  }
`

interface BookmarkCardProps {
  ref?: any
}

/** 书签卡片 */
export const BookmarkCard = styled.div<BookmarkCardProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150px;
  background-color: #fff;
  border-radius: 4px;
  padding: 24px;

  .trigger-layer {
    ${globalStyle.extendClick};
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 22px;
  }

  /** 浮层 */
  .layer {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10px 20px;
    z-index: 9;
    > * {
      margin: 8px 0;
    }
  }

  .plus {
    cursor: pointer;
    font-size: 48px;
    font-weight: bolder;
    color: ${globalStyle['font-color-desc-v2']};
  }

  .cover {
    width: 66px;
    height: 66px;
    object-fit: cover;
    object-position: 0 0;
    /* border-radius: 50%; */
  }

  .label {
    margin-top: 10px;
    line-height: 24px;
    color: ${globalStyle['font-color-desc']};

    > a {
      color: inherit;
    }
  }
`
// ${globalStyle.noWrapWithLine(3)};
