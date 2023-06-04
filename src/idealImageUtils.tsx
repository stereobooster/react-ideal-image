import { iconKeys, iconMap, type IconKeys, type IconMap } from "Icons";
import { loadStates } from "loaders";
import type { SrcType } from "types";

export const ssr = (): boolean =>
  typeof window === "undefined" || window.navigator.userAgent === "ReactSnap";

export const nativeConnection = () =>
  !ssr() && "connection" in window.navigator;

export const guessMaxImageWidth = (dimensions, w?) => {
  if (ssr()) return 0;

  // Default to window object but don't use window as a default
  // parameter so that this can be used on the server as well
  if (!w) {
    w = window;
  }

  const imgWidth = dimensions.width;

  const { screen } = w;
  const sWidth = screen.width;
  const sHeight = screen.height;

  const { documentElement } = document;
  const windowWidth = w.innerWidth || documentElement.clientWidth;
  const windowHeight = w.innerHeight || documentElement.clientHeight;
  const devicePixelRatio = w.devicePixelRatio || 1;

  const windowResized = sWidth > windowWidth;

  let result;
  if (windowResized) {
    const body = document.getElementsByTagName("body")[0];
    const scrollWidth = windowWidth - imgWidth;
    const isScroll =
      body.clientHeight > windowHeight || body.clientHeight > sHeight;
    if (isScroll && scrollWidth <= 15) {
      result = sWidth - scrollWidth;
    } else {
      result = (imgWidth / windowWidth) * sWidth;
    }
  } else {
    result = imgWidth;
  }

  return result * devicePixelRatio;
};

export const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = Math.floor(Math.log(bytes) / Math.log(1024)) || 0;
  return i === 0
    ? `${bytes} ${sizes[i]}`
    : `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

export const selectSrc = ({ srcSet, maxImageWidth }): SrcType => {
  switch (srcSet.length) {
    case 0:
      throw new Error("Need at least one item in srcSet");
    case 1:
      return srcSet[0];
    default: {
      const sorted = srcSet.toSorted((a, b) => a.width - b.width);
      const filteredSources = sorted.filter((x) => x.width >= maxImageWidth);

      return filteredSources.length
        ? filteredSources[0] // return smallest of the largest
        : sorted.at(-1); // return the largest
    }
  }
};

export interface AutodownloadInterface {
  connection?: Partial<NetworkInformation>;
  inViewport?: boolean;
  possiblySlowNetwork?: boolean;
  size?: number | string;
  threshold?: number;
  [x: string]: any;
}
export const defaultShouldAutoDownload = ({
  connection,
  inViewport = false,
  possiblySlowNetwork,
  size,
  threshold = 0, // TODO(noah): find a reasonable threshold number
}: AutodownloadInterface) => {
  if (!connection || inViewport)
    return true; // fallback to always auto download
  else if (possiblySlowNetwork || typeof size !== "number") return false;

  const { downlink, rtt = 0, effectiveType } = connection;
  switch (effectiveType) {
    case "slow-2g":
    case "2g":
      return false;
    case "3g":
      if (downlink && size && threshold) {
        return (size * 8) / (downlink * 1000) + rtt < threshold;
      }
      return false;
    default: // fast connections always autodownload
      return true;
  }
};

export const defaultGetMessage = (
  iconKey: IconKeys | null | string,
  imgState: Record<string, any>
) => {
  switch (iconKey) {
    case iconKeys.NoIcon:
    case iconKeys.Loaded:
      return null;
    case iconKeys.Loading:
      return "Loading...";
    case iconKeys.Initial:
    case iconKeys.Load:
      // we can show `alt` here
      if (imgState.size) {
        return (
          <span>
            Click to load (
            <span style={{ whiteSpace: "nowrap" }}>
              {bytesToSize(imgState.size as number)}
            </span>
            , ),
          </span>
        );
      } else {
        return "Click to load";
      }
    case iconKeys.Offline:
      return "Your browser is offline. Image not loaded";
    case iconKeys.Error:
    default:
      return imgState.loadInfo === 404
        ? "404. Image not found"
        : `Error: ${
            (imgState.loadInfo as string) || "unknown"
          }. Click to reload`;
  }
};

export const defaultGetIcon = ({
  imgState,
  networkState,
  icons = iconMap,
}: {
  imgState: Record<string, any>;
  networkState: Record<string, any>;
  icons?: IconMap;
}) => {
  if (ssr()) return icons[iconKeys.NoIcon];
  switch (imgState.state) {
    case loadStates.Loaded:
      return icons[iconKeys.Loaded];
    case loadStates.Loading:
      return networkState.overThreshold
        ? icons[iconKeys.Loading]
        : icons[iconKeys.NoIcon];
    case loadStates.Initial:
      if (networkState.onLine) {
        if (imgState.shouldAutoDownload === undefined)
          return icons[iconKeys.NoIcon];
        return imgState.userTriggered || !imgState.shouldAutoDownload
          ? icons[iconKeys.Load]
          : icons[iconKeys.NoIcon];
      } else {
        return icons[iconKeys.Offline];
      }
    case loadStates.Error:
      return networkState.onLine
        ? icons[iconKeys.Error]
        : icons[iconKeys.Offline];
    default:
      return () => null;
  }
};
