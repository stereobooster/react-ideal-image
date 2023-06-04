// TODO(noah): move all the shared types in here
// ^ check idealimage, media, and image that shiz is getting out of hand

import type { RefObject } from "react";
import type { MotionProps } from "framer-motion";

import type { Theme } from "./theme";

export type SvgRef = RefObject<SVGSVGElement>;

type BaseProps = {
  width: string | number;
  //
  height?: string | number;
  theme?: Theme;
};

export interface SrcType extends BaseProps {
  src: string;
  //
  size?: number;
  format?: string; // we dont care: but @see https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
}

export type SrcSet = SrcType[];

export type GetUrl = (x: SrcType) => string;

export type IdealImageProps = BaseProps & {
  alt: string;
  srcSet: SrcSet;
  motionProps?: MotionProps;
};
