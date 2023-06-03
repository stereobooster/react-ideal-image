import { useMemo, forwardRef, type FC } from "react";

import { loadStates, type LoadStates } from "loaders";
import type { Theme } from "theme";
import type { SvgRef } from "types";

export interface ImageInterface {
  alt: string;
  loadState: LoadStates;
  ref: SvgRef;
  theme: Theme;
  width: number | string;
  //
  height?: number | string;
  src?: string;
}
export const Image = forwardRef(function Image(
  {
    theme,
    loadState,
    width,
    height,
    alt,
    //
    src = "",
  }: ImageInterface,
  svgRef
) {
  const imageProps = useMemo(() => {
    const baseProps = { width, height, alt };

    return src && loadState === loadStates.Loaded
      ? {
          ...baseProps,
          src,
        }
      : {
          ...baseProps,
          ref: svgRef,
        };
  }, [loadState, src, alt, width, height, svgRef, theme]);

  return loadState === loadStates.Loaded ? (
    <img {...imageProps} />
  ) : (
    <svg {...imageProps} />
  );
});
