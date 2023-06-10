import { useMemo, type FC, type CSSProperties } from "react";

import type { GetUrl, SrcSet } from "types";

import { theme } from "theme";
import { ssr } from "idealImageUtils";

const defaultStyle = { ...theme.img, ...theme.noscript };

export interface NoscriptInterface {
  srcSet: SrcSet;
  alt: string;
  width: number | string;
  //
  height?: number | string;
  getUrl?: GetUrl;
  style?: CSSProperties;
}
export const Noscript: FC<NoscriptInterface> = ({
  alt,
  height,
  width,
  srcSet,
  getUrl,
  //
  style = {},
}) => {
  const fallbackParams = useMemo(() => {
    if (!srcSet.length || ssr()) return {};

    return {
      srcSet: srcSet
        .map((x) => `${getUrl ? getUrl(x) : x.src} ${x.width}w`)
        .join(","),
      src: getUrl ? getUrl(srcSet[0]) : srcSet[0].src,
    };
  }, [srcSet, getUrl]);

  return !ssr() ? null : (
    <noscript>
      <img
        style={{ ...defaultStyle, ...style }}
        {...fallbackParams}
        alt={alt}
        width={width}
        height={height}
      />
    </noscript>
  );
};
