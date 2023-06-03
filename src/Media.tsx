import {
  useEffect,
  useMemo,
  useRef,
  type FC,
  type ReactNode,
  type MouseEventHandler,
} from "react";

import type { SvgRef, SrcSet, GetUrl } from "types";
import type { Theme } from "theme";

import { IconWrapper, type IconType } from "Icons";
import { Image } from "Image";
import { Noscript } from "Noscript";
import { loadStates, type LoadStates } from "loaders";

export interface MediaInterface {
  alt: string;
  icon: IconType;
  loadState: LoadStates;
  message: ReactNode;
  width: number | string;
  theme: Theme;
  onDimensions: Function;
  srcSet: SrcSet;
  //
  className?: string;
  getUrl?: GetUrl;
  height?: number | string;
  iconColor?: string;
  iconSize?: number;
  onClick?: MouseEventHandler;
  placeholder?: string;
  src?: string;
  style?: Record<string, any>;
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
  className = "",
  getUrl,
  iconColor = "#fff",
  iconSize = 64,
  message = "",
  onClick,
  onDimensions,
  src = "",
  style = {},
}) => {
  const useIconStyle = useMemo(
    () => ({
      width: iconSize + 100,
      height: iconSize,
      color: iconColor,
    }),
    [iconSize, iconColor]
  );

  const useDivStyles = useMemo(() => {
    const background =
      loadState === loadStates.Loaded ? {} : { backgroundColor: placeholder };

    return {
      ...background,
      ...theme.placeholder,
      ...style,
    };
  }, [loadState, theme, style, placeholder]);

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
    <div className={className} style={useDivStyles} onClick={onClick}>
      <Image
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
        style={useDivStyles}
        width={width}
      />
      <IconWrapper
        MyIcon={icon}
        message={message}
        fill={iconColor}
        size={iconSize}
        style={useIconStyle}
      />
    </div>
  );
};
