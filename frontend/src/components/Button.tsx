import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import Icon, { IconsTypes } from './Icon'
import { BUTTON_SIZE_STYLE, BUTTON_TYPE_STYLE } from '../types/Catalog'

interface IButton {
  title?: string
  type?: string
  onClick: () => void
  leftIcon?: IconsTypes
  disabled?: boolean
  fontColor?: string
  preventDefault?: boolean
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>
  className?: string
  stopPropagation?: boolean
  size:string
}

const Button: React.FC<IButton> = ({
  title,
  onClick,
  type = 'primary',
  leftIcon,
  disabled = false,
  fontColor,
  preventDefault = true,
  onMouseLeave,
  className,
  stopPropagation,
  size
}) => {
  return (
    <Container
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        preventDefault && e.preventDefault()
        stopPropagation && e.stopPropagation()
        onClick()
      }}
      type="button"
      disabled={disabled}
      $fontColor={fontColor}
      $buttonStyle={{
        ...BUTTON_TYPE_STYLE[type],
        ...BUTTON_SIZE_STYLE[size],

      }}
      onMouseLeave={onMouseLeave}
      className={`${className ?? ''}`}
    >
      {leftIcon ? (
        <LeftIconContainer>
          <Icon
            type={leftIcon}
          />
        </LeftIconContainer>
      ) : null}
      {
        title &&<TextContainer>{title}</TextContainer>
      }
      
    </Container>
  )
}

export default Button

const LeftIconContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`

const TextContainer = styled.div`
  font-weight: 600;
  background-color: transparent;
  font-size: 14px;
`

const Container = styled.button<{
  $fontColor?: string
  $buttonStyle: any
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-style: solid;
  justify-content: center;
  min-width:64px;
  border-radius: 8px;
  border-color: #67683f;
  height: 24px;
  padding: 16px;
  font-size: 12px;
  color: #212121;
  background-color: #e3d400;
  position: relative;
  &:hover {
    background-color: #a2a473;
    cursor: pointer;
    
  }
  &:disabled {
    background-color:#f0f0ee9f;
  }
  &.unchecked {
    color: var(--fg_muted);
    background: var(--bg-light);
    border-style: hidden;
    border-radius: 8px;
  }
`
