import React from 'react'
import { ReactComponent as Apple } from '../assets/apple.svg'
import { ReactComponent as Cart } from '../assets/cart.svg'
import { ReactComponent as Delete } from '../assets/delete.svg'
import { ReactComponent as Plus } from '../assets/plus.svg'
import { ReactComponent as Add } from '../assets/add.svg'
import { ReactComponent as Trash } from '../assets/trash.svg'
import { ReactComponent as Home } from '../assets/home.svg'
import { ReactComponent as Export } from '../assets/export.svg'






import styled from 'styled-components'

export const icons = {
    'cart': <Cart/>,
    'delete': <Delete/>,
    'plus':<Plus/>,
    'add': <Add/>,
    'trash': <Trash/>,
    'home': <Home/>,
    'export': <Export/>

}

export type IconsTypes = keyof typeof icons

interface Props {
  type: IconsTypes
  defaultIcon?: IconsTypes
  fill?: string
  className?: string
  width?: number
  height?: number
  onClick?: (_: any) => any
  style?: { container?: React.CSSProperties; icon?: React.CSSProperties }
  tooltipText?: string
}

const Icon = ({
  type,
  className = '',
  defaultIcon,
  onClick = () => {},
  style,
  fill,
  tooltipText,
}: Props) => {
  const icon = icons[type]

  return icon ? (
    <IconContainer
      style={{
        display: tooltipText ? 'inherit' : 'contents',
        color: fill ? fill : undefined,
        ...style?.container,
      }}
    >
      {React.cloneElement<React.SVGProps<SVGSVGElement>>(icon, {
        className: className,
        onClick: onClick,
        style: style?.icon,
        fill: fill,
      })}

    </IconContainer>
  ) : defaultIcon ? (
    <Icon type={defaultIcon} className={className} fill={fill} />
  ) : null
}

const IconContainer = styled.span`
  display: block;
  position: relative;
`

export default Icon
