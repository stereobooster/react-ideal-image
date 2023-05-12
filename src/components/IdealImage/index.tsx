import React, {useState, useEffect, type FC} from 'react'
import { Waypoint } from 'react-waypoint'

import Media from '../Media'
import { icons, loadStates } from '../constants'
import {xhrLoader, imageLoader, timeout, combineCancel} from '../loaders'
import {
  guessMaxImageWidth,
  bytesToSize,
  supportsWebp,
  ssr,
  nativeConnection,
  selectSrc,
  fallbackParams,
} from '../helpers'

const {initial, loading, loaded, error} = loadStates

const defaultShouldAutoDownload = ({
  connection,
  size,
  threshold,
  possiblySlowNetwork,
}) => {
  if (possiblySlowNetwork) return false
  if (!connection) return true
  const {downlink, rtt, effectiveType} = connection
  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return false
    case '3g':
      if (downlink && size && threshold) {
        return (size * 8) / (downlink * 1000) + rtt < threshold
      }
      return false
    case '4g':
    default:
      return true
  }
}

const defaultGetMessage = (icon, state) => {
  switch (icon) {
    case icons.noicon:
    case icons.loaded:
      return null
    case icons.loading:
      return 'Loading...'
    case icons.load:
      // we can show `alt` here
      const {pickedSrc} = state
      const {size} = pickedSrc
      if (size) {
        return [
          'Click to load (',
          <nobr key="nb">{bytesToSize(size)}</nobr>,
          ')',
        ]
      } else {
        return 'Click to load'
      }
    case icons.offline:
      return 'Your browser is offline. Image not loaded'
    case icons.error:
      const {loadInfo} = state
      if (loadInfo === 404) {
        return '404. Image not found'
      } else {
        return 'Error. Click to reload'
      }
    default:
      throw new Error(`Wrong icon: ${icon}`)
  }
}

const defaultGetIcon = state => {
  const {loadState, onLine, overThreshold, userTriggered} = state
  if (ssr) return icons.noicon
  switch (loadState) {
    case loaded:
      return icons.loaded
    case loading:
      return overThreshold ? icons.loading : icons.noicon
    case initial:
      if (onLine) {
        const {shouldAutoDownload} = state
        if (shouldAutoDownload === undefined) return icons.noicon
        return userTriggered || !shouldAutoDownload ? icons.load : icons.noicon
      } else {
        return icons.offline
      }
    case error:
      return onLine ? icons.error : icons.offline
    default:
      throw new Error(`Wrong state: ${loadState}`)
  }
}

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
  shouldAutoDownload = defaultShouldAutoDownload,
  threshold,
}) => {
    // TODO: validate props.srcSet
  const [state, setState] = useState({
    // new
    dimensions: {}, // TODO(noah): comes from Media
    loadInfo: 0,
    url: '',
    pickedSrc: {},
    // prev
    loadState: initial,
      connection: nativeConnection
        ? {
            downlink: navigator.connection.downlink, // megabits per second
            rtt: navigator.connection.rtt, // ms
            effectiveType: navigator.connection.effectiveType, // 'slow-2g', '2g', '3g', or '4g'
          }
        : null,
      onLine: true,
      overThreshold: false,
      inViewport: false,
      userTriggered: false,
      possiblySlowNetwork: false,
  })

  const [withLoader, setLoader] = useState<null | Record<string, any>>();

  const updateConnection = () => {
    if (!navigator.onLine) return
    if (state.loadState === initial) {
      setState({
        ...state,
        connection: {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
        },
      })
    }
  }

  const possiblySlowNetworkListener = (e) => {
    if (state.loadState !== initial) return

    const {possiblySlowNetwork} = e.detail
    if (!state.possiblySlowNetwork && possiblySlowNetwork) {
      setState({...state, possiblySlowNetwork})
    }
  }

  const updateOnlineStatus = () => setState({...state, onLine: navigator.onLine})

   const onClick = () => {
    const {loadState, onLine, overThreshold} = state
    if (!onLine) return
    switch (loadState) {
      case loading:
        if (overThreshold) cancel(true)
        break;
      case initial:
      case error:
        load(true)
        break
      case loaded: break;
      default:
        throw new Error(`Wrong state: ${loadState}`)
    }
  }

  const clear = () => {
    if (withLoader) {
      withLoader.cancel()
      setLoader(null)
    }
  }

  const cancel = (userTriggered)  =>{
    if (loading !== state.loadState) return
    clear()
    loadStateChange(initial, userTriggered)
  }

  const loadStateChange = (loadState, userTriggered, loadInfo = 0) => {
    setState({
      ...state,
      loadState,
      overThreshold: false,
      userTriggered: !!userTriggered,
      loadInfo,
    })
  }

  const load = userTriggered => {
    const {loadState, url} = state

    // TODO(noah): this is the fkn problem
    // ^ when we call load in componentDidUpdate loading === loadState
    // if (ssr || loaded === loadState || loading === loadState) return
    loadStateChange(loading, userTriggered)

    const newLoader =
      loader === 'xhr' ? xhrLoader(url) : imageLoader(url)

    newLoader
      .then(() => {
        clear()
        loadStateChange(loaded, false)
      })
      .catch(e => {
        clear()
        if (e.status === 404) {
          loadStateChange(error, false, 404)
        } else {
          loadStateChange(error, false)
        }
      })

    if (threshold) {
      const timeoutLoader = timeout(threshold)

      timeoutLoader.then(() => {
        if (!withLoader) return
          window.document.dispatchEvent(
            new CustomEvent('possiblySlowNetwork', {
              detail: {possiblySlowNetwork: true},
            }),
          )
        setState({...state, overThreshold: true})
        if (!state.userTriggered) cancel(true)
      })
      setLoader(combineCancel(newLoader, timeoutLoader))
    } else {
      setLoader(newLoader)
    }
  }

  const onEnter = () => {
    if (state.inViewport) return

    setState({ ...state, inViewport: true })

    const pickedSrc = selectSrc({
      srcSet: srcSet,
      maxImageWidth:
        srcSet.length > 1
          ? guessMaxImageWidth(state.dimensions) // eslint-disable-line react/no-access-state-in-setstate
          : 0,
      supportsWebp,
    })

    const url = getUrl ? getUrl(pickedSrc) : pickedSrc.src

    const autoDownload = shouldAutoDownload({
      ...state,
      size: pickedSrc.size,
    })

    setState({...state, pickedSrc, shouldAutoDownload: autoDownload, url})
    if (autoDownload) load(false)
  }

  const onLeave = () => {
    if (state.loadState === loading && !state.userTriggered) {
      setState({ ...state, inViewport: false})
      cancel(false)
    }
  }

  useEffect(() => {
    if (nativeConnection)
      navigator.connection.addEventListener('onchange', updateConnection)
    else if (threshold)
      window.document.addEventListener('possiblySlowNetwork', possiblySlowNetworkListener)
    updateOnlineStatus()
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      clear()
      if (nativeConnection)
        navigator.connection.removeEventListener('onchange', updateConnection)
      else if (threshold)
        window.document.removeEventListener('possiblySlowNetwork',possiblySlowNetworkListener)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // TODO(noah): shouldnt be needed any more
  // componentDidUpdate(prevProps, prevState) {
  //   // TODO(noah): this fixes the problem
  //   // ^ for some reason when this.state.url is changed this.load is triggered
  //   // ^ thus only the placeholder is shown and the real img is never fetched
  //   if (prevState.url !== this.state.url) {
  //     console.info('\n\n state updated')
  //     this.load(false)
  //   }
  // }


    const icon = getIcon(state)
    const message = getMessage(icon, state)
    const useProps = {
      getIcon,
      getMessage,
      getUrl,
      height,
      icons,
      loader,
      placeholder,
      shouldAutoDownload,
      srcSet,
      theme,
      threshold,
      width,
    }

    return (
      <Waypoint onEnter={onEnter} onLeave={onLeave}>
        <Media
          {...useProps}
          {...fallbackParams(useProps)}
          onClick={onClick}
          icon={icon}
          src={state.url}
          onDimensions={dimensions => setState({dimensions})}
          message={message}
        />
      </Waypoint>
    )
}

export default IdealImage;
