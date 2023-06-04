import { type CSSProperties } from "react";

export type Theme = Record<string, CSSProperties>;

export const theme: Theme = {
  wrapper: {},
  placeholder: {
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    position: "relative",
  },
  img: {
    width: "100%",
    height: "auto",
    maxWidth: "100%",
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
  noscript: {
    position: "absolute",
    top: 0,
    left: 0,
  },
};

export type ThemeKeys = keyof typeof theme;
