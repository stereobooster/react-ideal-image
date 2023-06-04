import { useState, useEffect, useMemo, useCallback, type FC } from "react";
import { motion } from "framer-motion";

import type { GetUrl, IdealImageProps } from "types";

import { theme as defaultTheme } from "theme";
import { Media } from "./Media";
import { iconKeys, iconMap, type IconMap } from "Icons";
import {
  combineCancel,
  idealLoader,
  loadStates,
  timeout,
  type LoadStates,
  type Cancelable,
} from "./loaders";
import {
  defaultGetIcon,
  defaultGetMessage,
  defaultShouldAutoDownload,
  guessMaxImageWidth,
  nativeConnection,
  selectSrc,
  ssr,
} from "./idealImageUtils";

export interface IdealImageInterface extends IdealImageProps {
  //
  getIcon?: typeof defaultGetIcon;
  getMessage?: typeof defaultGetMessage;
  getUrl?: GetUrl;
  height?: number | string;
  icons?: IconMap;
  loader?: "xhr" | "image";
  placeholder?: string;
  shouldAutoDownload?: typeof defaultShouldAutoDownload;
  threshold?: number;
  className?: string;
}

export const IdealImage: FC<IdealImageInterface> = ({
  srcSet,
  width,
  alt,
  //
  className = "id-img",
  getIcon = defaultGetIcon,
  getMessage = defaultGetMessage,
  getUrl,
  height,
  icons = {},
  loader = "xhr",
  motionProps = {},
  placeholder = "black",
  shouldAutoDownload = defaultShouldAutoDownload,
  theme = {},
  threshold,
}) => {
  const useIcons = {
    ...iconMap,
    ...icons,
  };

  const useTheme = useMemo(
    () => ({
      ...defaultTheme,
      ...theme,
    }),
    [theme]
  );

  const useStyle = useMemo(
    () => ({
      width,
      height,
      ...theme.wrapper,
    }),
    [theme, width, height]
  );

  const [withLoader, setLoader] = useState<null | Cancelable>();
  const [dimensions, setDimensions] = useState({});
  const [imgState, setImgState] = useState({
    loadInfo: 0,
    pickedSrc: {},
    shouldAutoDownload: false,
    state: loadStates.Initial,
    url: "",
    userTriggered: false,
  });
  const [networkState, setNetworkState] = useState({
    onLine: navigator?.onLine,
    overThreshold: false,
    possiblySlowNetwork: false,
    connection: nativeConnection()
      ? {
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
          effectiveType: navigator.connection.effectiveType,
        }
      : {},
  });

  const updateConnection = () => {
    if (!networkState.onLine) return;
    if (imgState.state === loadStates.Initial) {
      setNetworkState((prevState) => ({
        ...prevState,
        connection: nativeConnection()
          ? {
              effectiveType: navigator.connection?.effectiveType,
              downlink: navigator.connection?.downlink,
              rtt: navigator.connection?.rtt,
            }
          : {},
      }));
    }
  };

  const possiblySlowNetworkListener = (e) => {
    if (imgState.state !== loadStates.Initial) return;

    const { possiblySlowNetwork } = e.detail;
    if (networkState.possiblySlowNetwork !== possiblySlowNetwork) {
      setNetworkState((prevState) => ({ ...prevState, possiblySlowNetwork }));
    }
  };

  const updateOnlineStatus = () => {
    if (networkState.onLine !== navigator?.onLine)
      setNetworkState((prevState) => ({
        ...prevState,
        onLine: navigator.onLine,
      }));
  };

  const onClick = () => {
    if (!networkState.onLine) return;

    switch (imgState.state) {
      case loadStates.Loading:
        if (networkState.overThreshold) cancel(true);
        break;
      case loadStates.Initial:
      case loadStates.Error:
        load(true);
        break;
      default:
        return;
    }
  };

  const clear = useCallback(() => {
    if (withLoader) {
      withLoader.cancel();
      setLoader(null);
    }
  }, [withLoader]);

  const loadStateChange = useCallback(
    (loadState, userTriggered, loadInfo = 0) => {
      if (networkState.overThreshold)
        setNetworkState((prevState) => ({
          ...prevState,
          overThreshold: false,
        }));

      if (
        imgState.state !== loadState ||
        imgState.userTriggered !== userTriggered ||
        imgState.loadInfo !== loadInfo
      )
        setImgState((prevState) => ({
          ...prevState,
          state: loadState,
          userTriggered: !!userTriggered,
          loadInfo,
        }));
    },
    [imgState, networkState]
  );

  const cancel = useCallback(
    (userTriggered) => {
      if (loadStates.Loading !== imgState.state) return;
      clear();
      loadStateChange(loadStates.Initial, userTriggered);
    },
    [clear, imgState, loadStateChange]
  );

  const load = useCallback(
    (userTriggered) => {
      if (
        !imgState.url ||
        ssr() ||
        [loadStates.Loading, loadStates.Loaded].includes(imgState.state)
      ) {
        return;
      }

      loadStateChange(loadStates.Loading, userTriggered);

      const newLoader = idealLoader(loader)(imgState.url);

      newLoader
        .then(() => {
          clear();
          loadStateChange(loadStates.Loaded, false);
        })
        .catch((e) => {
          clear();
          loadStateChange(loadStates.Error, false, e.status as number);
        });

      if (threshold) {
        const timeoutLoader = timeout(threshold);

        timeoutLoader.then(() => {
          if (!withLoader) return;
          window.document.dispatchEvent(
            new CustomEvent("possiblySlowNetwork", {
              detail: { possiblySlowNetwork: true },
            })
          );
          if (!networkState.overThreshold)
            setNetworkState((prevState) => ({
              ...prevState,
              overThreshold: true,
            }));
          if (!imgState.userTriggered) cancel(true);
        });

        setLoader(combineCancel(newLoader, timeoutLoader));
      } else {
        setLoader(newLoader);
      }
    },
    [
      cancel,
      clear,
      imgState,
      loadStateChange,
      loader,
      networkState,
      threshold,
      withLoader,
    ]
  );

  const onEnter = (e: IntersectionObserverEntry | null) => {
    if (imgState.state === iconKeys.Loaded) return;

    const pickedSrc = selectSrc({
      srcSet,
      maxImageWidth: srcSet.length > 1 ? guessMaxImageWidth(dimensions) : 0,
    });

    setImgState((prevState) => ({
      ...prevState,
      shouldAutoDownload: shouldAutoDownload({
        ...networkState,
        size: pickedSrc.width,
        threshold,
        inViewport: true,
      }),
      url: getUrl ? getUrl(pickedSrc) : pickedSrc.src,
      pickedSrc,
    }));
  };

  const onLeave = (e: IntersectionObserverEntry | null) => {
    if (imgState.state === iconKeys.Loaded) return;

    if (imgState.state === loadStates.Loading && !imgState.userTriggered) {
      cancel(false);
    }
  };

  useEffect(() => {
    if (imgState.state === iconKeys.Loaded) return;

    if (nativeConnection()) {
      navigator.connection.addEventListener("onchange", updateConnection);
    } else if (threshold) {
      window.document.addEventListener(
        "possiblySlowNetwork",
        possiblySlowNetworkListener,
        { passive: true }
      );
    }
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus, { passive: true });
    window.addEventListener("offline", updateOnlineStatus, { passive: true });

    return () => {
      if (nativeConnection()) {
        navigator.connection.removeEventListener("onchange", updateConnection);
      } else if (threshold) {
        window.document.removeEventListener(
          "possiblySlowNetwork",
          possiblySlowNetworkListener
        );
      }
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  });

  useEffect(() => {
    if (
      imgState.url &&
      ![iconKeys.Loaded, iconKeys.Loading].includes(imgState.state)
    ) {
      if (imgState.shouldAutoDownload) {
        load(false);
      }
    }
  }, [imgState, load]);

  const icon = useMemo(
    () =>
      getIcon({
        imgState,
        networkState,
        icons: useIcons,
      }),
    [useIcons, imgState, networkState]
  );

  return (
    <motion.div
      className={className}
      onViewportEnter={onEnter}
      onViewportLeave={onLeave}
      style={useStyle}
    >
      <Media
        motionProps={motionProps}
        alt={alt}
        getUrl={getUrl}
        height={height}
        icon={icon}
        loadState={imgState.state as unknown as LoadStates}
        message={getMessage(imgState.state, imgState)}
        onClick={onClick}
        onDimensions={setDimensions}
        placeholder={placeholder}
        src={imgState.url}
        srcSet={srcSet}
        theme={useTheme}
        width={width}
      />
    </motion.div>
  );
};
