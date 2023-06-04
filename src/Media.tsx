import {
  useEffect,
  useMemo,
  useRef,
  type FC,
  type ReactNode,
  type MouseEventHandler,
} from "react";
import { SetRequired } from "type-fest";
import type { SvgRef, GetUrl, IdealImageProps } from "types";

import { IconWrapper, type IconType } from "Icons";
import { Image } from "Image";
import { Noscript } from "Noscript";
import { type LoadStates } from "loaders";

export interface MediaInterface extends SetRequired<IdealImageProps, "theme"> {
  icon: IconType;
  loadState: LoadStates;
  message: ReactNode;
  onDimensions: Function;
  //
  getUrl?: GetUrl;
  iconColor?: string;
  iconSize?: number;
  onClick?: MouseEventHandler;
  placeholder?: string;
  src?: string;
}

export const Media: FC<MediaInterface> = ({
  alt,
  width,
  height,
  loadState,
  theme,
  icon,
  srcSet,
  placeholder,
  //
  getUrl,
  iconColor = "#fff",
  iconSize = 64,
  message = "",
  motionProps = {},
  onClick,
  onDimensions,
  src = "",
}) => {
  const useIconStyle = useMemo(
    () => ({
      width: iconSize + 100,
      height: iconSize,
      color: iconColor,
      ...theme.icon,
    }),
    [iconSize, iconColor, theme]
  );

  const useStyle = useMemo(
    () => ({
      ...theme.placeholder,
      backgroundColor: placeholder,
    }),
    [theme, placeholder]
  );

  const SvgRef: SvgRef = useRef(null);

  useEffect(() => {
    if (SvgRef.current) {
      /* Firefox returns 0 for both clientWidth and clientHeight.
      To fix this we can check the parentElement's clientWidth and clientHeight as a fallback. */
      onDimensions({
        width:
          SvgRef.current.clientWidth ||
          SvgRef.current.parentElement?.clientWidth,
        height:
          SvgRef.current.clientHeight ||
          SvgRef.current.parentElement?.clientHeight,
      });
    }
  }, [onDimensions]);

  return (
    <div style={useStyle} onClick={onClick}>
      <Image
        motionProps={motionProps}
        alt={alt}
        height={height}
        loadState={loadState}
        ref={SvgRef}
        src={src}
        theme={theme}
        width={width}
      />
      <Noscript
        alt={alt}
        getUrl={getUrl}
        height={height}
        srcSet={srcSet}
        style={theme.noscript}
        width={width}
      />
      <IconWrapper
        fill={iconColor}
        message={message}
        MyIcon={icon}
        size={iconSize}
        style={useIconStyle}
      />
    </div>
  );
};
