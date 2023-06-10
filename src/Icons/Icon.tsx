import {
  memo,
  type FC,
  type SVGProps,
  type CSSProperties,
  type ReactNode,
  type ComponentType,
} from "react";

export interface IconInterface extends SVGProps<SVGSVGElement> {
  path?: string;
  fill?: string;
  size?: number;
}

export const Icon: FC<IconInterface> = ({
  size = 24,
  fill = "#000",
  className,
  path,
  width,
  height,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width || size}
    height={height || size}
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path fill={fill} d={path} />
  </svg>
);

export type IconType = ComponentType<IconInterface> | typeof Icon | null;

export interface IconWrapperInterface extends IconInterface {
  //
  message?: ReactNode;
  MyIcon?: IconType;
  style?: CSSProperties;
}

export const IconWrapper = memo(function IconWrapper({
  MyIcon,
  style = {},
  message,
  ...iconProps
}: IconWrapperInterface) {
  return !MyIcon ? null : (
    <div style={style}>
      <MyIcon {...iconProps} />
      <br />
      {message ? <span key="message">{message}</span> : null}
    </div>
  );
});
