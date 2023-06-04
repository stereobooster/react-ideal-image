import { useMemo, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SetRequired } from "type-fest";

import { loadStates, type LoadStates } from "loaders";
import type { SvgRef, IdealImageProps } from "types";

export interface ImageInterface
  extends Omit<SetRequired<IdealImageProps, "theme">, "srcSet"> {
  loadState: LoadStates;
  ref: SvgRef;
  //
  src?: string;
}
export const Image = forwardRef(function Image(
  {
    alt,
    height,
    loadState,
    theme,
    width,
    //
    motionProps = {},
    src = "",
  }: ImageInterface,
  svgRef
) {
  const useMotionProps = useMemo(
    () => ({
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true },
      exit: { opacity: 0 },
      layout: true,
      ...motionProps,
    }),
    [motionProps]
  );
  const imageProps = useMemo(() => {
    const baseProps = { width, height, alt };
    const style = { ...theme.img, width, height };
    return src && loadState === loadStates.Loaded
      ? {
          ...baseProps,
          src,
          style,
        }
      : {
          ...baseProps,
          ref: svgRef,
          style,
        };
  }, [loadState, src, alt, width, height, svgRef, theme]);

  return loadState === loadStates.Loaded ? (
    <AnimatePresence>
      <motion.div {...useMotionProps}>
        <img {...imageProps} />
      </motion.div>
    </AnimatePresence>
  ) : (
    <AnimatePresence>
      <motion.div {...useMotionProps}>
        <svg {...imageProps} />
      </motion.div>
    </AnimatePresence>
  );
});
