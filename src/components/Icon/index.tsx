import React, {type FC} from 'react'

export interface IconProps {
  path: string
  //
  className?: string
  fill?: string
  size?: number
}

const Icon: FC<IconProps> = ({size = 24, fill = '#000', className, path}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" key="path1" />
    <path fill={fill} d={path} key="path2" />
  </svg>
)

export default Icon
