import {useState, useEffect, type FC} from 'react'
import {Waypoint} from 'react-waypoint'

import Media from '../Media'
import {loadStates} from '../constants'
import {xhrLoader, imageLoader, timeout, combineCancel} from '../loaders'
import {
  guessMaxImageWidth,
  supportsWebp,
  nativeConnection,
  selectSrc,
  fallbackParams,
  ssr,
} from '../helpers'
import { defaultShouldAutoDownload, defaultGetMessage, defaultGetIcon } from './defaults';

const IdealImage: FC<ImageProps> = ({
  height,
  icons,
  placeholder,
  srcSet,
  theme,
  width,
  //
  getIcon = defaultGetIcon,
  getMessage = defaultGetMessage,
  getUrl,
  loader = 'xhr',
  threshold,
  shouldAutoDownload = defaultShouldAutoDownload
}) => {
  const [withLoader, setLoader] = useState<null | Record<string, any>>()
  const [dimensions, setDimensions] = useState({})
  const [imgState, setImgState] = useState({
    inViewport: false,
    loadInfo: 0,
    pickedSrc: {},
    shouldAutoDownload: false,
    state: loadStates.initial,
    url: '',
    userTriggered: false,
  })
  const [networkState, setNetworkState] = useState({
    onLine: true,
    overThreshold: false,
    possiblySlowNetwork: false,
    connection: nativeConnection
      ? {
          downlink: navigator.connection.downlink, // megabits per second
          rtt: navigator.connection.rtt, // ms
          effectiveType: navigator.connection.effectiveType, // 'slow-2g', '2g', '3g', or '4g'
        }
      : undefined,
  })

  const updateConnection = () => {
    if (!navigator.onLine) return
    if (imgState.state === loadStates.initial) {
      setNetworkState({
        ...networkState,
        connection: {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
        },
      })
    }
  }

  const possiblySlowNetworkListener = e => {
    if (imgState.state !== loadStates.initial) return

    const {possiblySlowNetwork} = e.detail
    if (!networkState.possiblySlowNetwork && possiblySlowNetwork) {
      setNetworkState({ ...networkState, possiblySlowNetwork})
    }
  }

  const updateOnlineStatus = () => {
    setNetworkState({ ...networkState, onLine: navigator.onLine})
  }

  const onClick = () => {
    if (!networkState.onLine) return
    switch (imgState.state) {
      case loadStates.loading:
        if (networkState.overThreshold) cancel(true)
        break
      case loadStates.initial:
      case loadStates.error:
        load(true)
        break
      case loadStates.loaded:
        break
      default:
        throw new Error(`Wrong state: ${imgState.state}`)
    }
  }

  const clear = () => {
    if (withLoader) {
      withLoader.cancel()
      setLoader(null)
    }
  }

  const cancel = userTriggered => {
    if (loadStates.loading !== imgState.state) return
    clear()
    loadStateChange(loadStates.initial, userTriggered)
  }

  const loadStateChange = (loadState, userTriggered, loadInfo = 0) => {
    setNetworkState({
      ...networkState,
      overThreshold: false,
    })
    setImgState({
      ...imgState,
      state: loadState, // TODO(noah): rename to status
      userTriggered: !!userTriggered,
      loadInfo,
    })
  }

  const load = userTriggered => {
    if (!imgState.url || ssr || [loadStates.loaded, loadStates.loaded].includes(imgState.state)) return;

    loadStateChange(loadStates.loading, userTriggered)

    const newLoader = loader === 'xhr' ? xhrLoader(imgState.url) : imageLoader(imgState.url)

    newLoader
      .then(() => {
        clear()
        loadStateChange(loadStates.loaded, false)
      })
      .catch(e => {
        clear()
        if (e.status === 404) {
          loadStateChange(loadStates.error, false, 404)
        } else {
          loadStateChange(loadStates.error, false)
        }
      })

    if (threshold) {
      const timeoutLoader = timeout(threshold)

      timeoutLoader.then(() => {
        if (!withLoader) return
        window.document.dispatchEvent(
          new CustomEvent('possiblySlowNetwork', {
            detail: { possiblySlowNetwork: true },
          }),
        )
        setNetworkState({ ...networkState, overThreshold: true })
        if (!imgState.userTriggered) cancel(true)
      });

      const combinedLoader = combineCancel(newLoader, timeoutLoader)
      setLoader(combinedLoader)
    } else {
      setLoader(newLoader)
    }
  }

  const onEnter = () => {
    if (imgState.inViewport) return;

    const pickedSrc = selectSrc({
      srcSet: srcSet,
      maxImageWidth:
        srcSet.length > 1
          ? guessMaxImageWidth(dimensions) // eslint-disable-line react/no-access-state-in-setstate
          : 0,
      supportsWebp,
    })

    const url =  getUrl ? getUrl(pickedSrc) : pickedSrc.src

    const autoDownload = shouldAutoDownload({
      ...networkState,
      size: pickedSrc.width,
      threshold,
    })

    setImgState({
      ...imgState,
      url,
      inViewport: true,
      pickedSrc,
      shouldAutoDownload: autoDownload
    });
  }

  const onLeave = () => {
    if (imgState.state === loadStates.loading && !imgState.userTriggered) {
      setImgState({ ...imgState, inViewport: false})
      cancel(false)
    }
  }

  useEffect(() => {
    if (nativeConnection)
      navigator.connection.addEventListener('onchange', updateConnection)
    else if (threshold)
      window.document.addEventListener(
        'possiblySlowNetwork',
        possiblySlowNetworkListener,
      )
    updateOnlineStatus()
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      clear()
      if (nativeConnection)
        navigator.connection.removeEventListener('onchange', updateConnection)
      else if (threshold)
        window.document.removeEventListener(
          'possiblySlowNetwork',
          possiblySlowNetworkListener,
        )
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  useEffect(() => {
    if (imgState.url && ![loadStates.loaded, loadStates.loading].includes(imgState.state)) {
      if (imgState.inViewport || imgState.shouldAutoDownload) {
        load(false)
      }
    }
  }, [imgState])

  const icon = getIcon({
    imgState,
    networkState
  });

  const message = getMessage(icon, imgState)
  const useProps = {
    height,
    icons,
    placeholder,
    srcSet,
    theme,
    threshold,
    width,
  }

  return (
    <Waypoint onEnter={onEnter} onLeave={onLeave}>
      <Media
        {...useProps}
        {...fallbackParams({ srcSet, getUrl })}
        onClick={onClick}
        icon={icon}
        src={imgState.url}
        onDimensions={dimensions => setDimensions(dimensions)}
        message={message}
      />
    </Waypoint>
  )
}

export default IdealImage
