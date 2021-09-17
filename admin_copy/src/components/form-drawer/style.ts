import styled from 'styled-components'
import globalStyle from '../../styles/global-style'

export const IconListWra = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  height: 660px;
  overflow-y: scroll;
  ${globalStyle.scrollDecorator(1)};
`

export const IconItemWra = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 16.66%;

  height: 60px;
  padding: 6px;
  font-size: 36px;
  cursor: pointer;
  /* transform: a */

  &:hover {
    color: #fff;
    background-color: ${globalStyle['theme-color']};
  }
`
