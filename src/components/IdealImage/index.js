import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import Waypoint from 'react-waypoint'
import Media from '../Media'
import {icons, loadStates} from '../constants'
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

const IdealImage = props => {
  // TODO: validate props.srcSet
  const [state, setState] = useState({
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
  const loaderRef = useRef(null)

  const clear = () => {
    if (loaderRef.current) {
      loaderRef.current.cancel()
      loaderRef.current = null
    }
  }

  let updateConnection, updateOnlineStatus, possiblySlowNetworkListener

  useEffect(() => {
    if (nativeConnection) {
      updateConnection = () => {
        if (!navigator.onLine) return
        if (state.loadState === initial) {
          setState({
            connection: {
              effectiveType: navigator.connection.effectiveType,
              downlink: navigator.connection.downlink,
              rtt: navigator.connection.rtt,
            },
          })
        }
      }
      navigator.connection.addEventListener('onchange', updateConnection)
    } else if (props.threshold) {
      possiblySlowNetworkListener = e => {
        if (state.loadState !== initial) return
        const {possiblySlowNetwork} = e.detail
        if (!state.possiblySlowNetwork && possiblySlowNetwork) {
          setState({possiblySlowNetwork})
        }
      }
      window.document.addEventListener(
        'possiblySlowNetwork',
        possiblySlowNetworkListener,
      )
    }
    updateOnlineStatus = () => setState({onLine: navigator.onLine})
    updateOnlineStatus()
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      clear()
      if (nativeConnection) {
        navigator.connection.removeEventListener('onchange', updateConnection)
      } else if (props.threshold) {
        window.document.removeEventListener(
          'possiblySlowNetwork',
          possiblySlowNetworkListener,
        )
      }
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  })

  const loadStateChange = (loadState, userTriggered, loadInfo = null) => {
    setState({
      loadState,
      overThreshold: false,
      userTriggered: !!userTriggered,
      loadInfo,
    })
  }

  const cancel = userTriggered => {
    if (loading !== state.loadState) return
    clear()
    loadStateChange(initial, userTriggered)
  }

  const load = userTriggered => {
    const {loadState, url} = state
    if (ssr || loaded === loadState || loading === loadState) return
    loadStateChange(loading, userTriggered)

    const {threshold} = props
    const loader = props.loader === 'xhr' ? xhrLoader(url) : imageLoader(url)
    loader
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
        if (!loader) return
        window.document.dispatchEvent(
          new CustomEvent('possiblySlowNetwork', {
            detail: {possiblySlowNetwork: true},
          }),
        )
        setState({overThreshold: true})
        if (!state.userTriggered) cancel(true)
      })
      loaderRef.current = combineCancel(loader, timeoutLoader)
    } else {
      loaderRef.current = loader
    }
  }

  const onClick = () => {
    const {loadState, onLine, overThreshold} = state
    if (!onLine) return
    switch (loadState) {
      case loading:
        if (overThreshold) cancel(true)
        return
      case loaded:
        // nothing
        return
      case initial:
      case error:
        load(true)
        return
      default:
        throw new Error(`Wrong state: ${loadState}`)
    }
  }

  const onEnter = () => {
    if (state.inViewport) return
    setState({inViewport: true})
    const pickedSrc = selectSrc({
      srcSet: props.srcSet,
      maxImageWidth:
        props.srcSet.length > 1
          ? guessMaxImageWidth(state.dimensions) // eslint-disable-line react/no-access-state-in-setstate
          : 0,
      supportsWebp,
    })
    const {getUrl} = props
    const url = getUrl ? getUrl(pickedSrc) : pickedSrc.src
    const shouldAutoDownload = props.shouldAutoDownload({
      ...state, // eslint-disable-line react/no-access-state-in-setstate
      size: pickedSrc.size,
    })
    setState({pickedSrc, shouldAutoDownload, url})
    if (shouldAutoDownload) load(false)
  }

  const onLeave = () => {
    if (state.loadState === loading && !state.userTriggered) {
      setState({inViewport: false})
      cancel(false)
    }
  }

  const icon = props.getIcon(state)
  const message = props.getMessage(icon, state)
  return (
    <Waypoint onEnter={onEnter} onLeave={onLeave}>
      <Media
        {...props}
        {...fallbackParams(props)}
        onClick={onClick}
        icon={icon}
        src={state.url || ''}
        onDimensions={dimensions => setState({dimensions})}
        message={message}
      />
    </Waypoint>
  )
}

IdealImage.propTypes = {
  /** how much to wait in ms until concider download to slow */
  threshold: PropTypes.number,
  /** function to generate src based on width and format */
  getUrl: PropTypes.func,
  /** array of sources */
  srcSet: PropTypes.arrayOf(
    PropTypes.shape({
      width: PropTypes.number.isRequired,
      src: PropTypes.string,
      size: PropTypes.number,
      format: PropTypes.oneOf(['jpeg', 'webp']),
    }),
  ).isRequired,
  /** function which decides if image should be downloaded */
  shouldAutoDownload: PropTypes.func,
  /** function which decides what message to show */
  getMessage: PropTypes.func,
  /** function which decides what icon to show */
  getIcon: PropTypes.func,
  /** type of loader */
  loader: PropTypes.oneOf(['image', 'xhr']),
  /** Width of the image in px */
  width: PropTypes.number.isRequired,
  /** Height of the image in px */
  height: PropTypes.number.isRequired,
  placeholder: PropTypes.oneOfType([
    PropTypes.shape({
      /** Solid color placeholder */
      color: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      /**
       * [Low Quality Image Placeholder](https://github.com/zouhir/lqip)
       * [SVG-Based Image Placeholder](https://github.com/technopagan/sqip)
       * base64 encoded image of low quality
       */
      lqip: PropTypes.string.isRequired,
    }),
  ]).isRequired,
  /** Map of icons */
  icons: PropTypes.object.isRequired,
  /** theme object - CSS Modules or React styles */
  theme: PropTypes.object.isRequired,
}

IdealImage.defaultProps = {
  shouldAutoDownload: defaultShouldAutoDownload,
  getMessage: defaultGetMessage,
  getIcon: defaultGetIcon,
  loader: 'xhr',
}

export default IdealImage
