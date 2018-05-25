import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Waypoint from 'react-waypoint'
import Media from '../Media'
import {icons, loadStates} from '../constants'
import {xhrLoader, timeout, cancelSecond} from '../loaders'
import supportsWebp from '../webp'

const {initial, loading, loaded, error} = loadStates

const ssr =
  typeof window === 'undefined' || window.navigator.userAgent === 'ReactSnap'

const nativeConnection =
  typeof window !== undefined && !!window.navigator.connection

export default class AdaptiveLoad extends Component {
  constructor(props) {
    super(props)
    const controledOnLine = props.onLine !== undefined
    this.state = {
      loadState: initial,
      downlink: nativeConnection
        ? navigator.connection.downlink // megabits per second
        : null,
      rtt: nativeConnection
        ? navigator.connection.rtt // ms
        : null,
      connection: nativeConnection
        ? navigator.connection.effectiveType // 'slow-2g', '2g', '3g', or '4g'
        : null,
      onLine: controledOnLine ? props.onLine : true,
      controledOnLine,
      overThreshold: false,
      inViewport: false,
      userTriggered: false,
      possiblySlowNetwork: false,
      src: props.src,
    }
  }

  static propTypes = {
    // core properties
    /** URL of the image */
    src: PropTypes.string.isRequired,
    /** how much to wait in ms until concider download to slow */
    threshold: PropTypes.number,
    /** size of src image in bytes */
    size: PropTypes.number,
    /** size of webp image in bytes */
    webpSize: PropTypes.number,
    /** function which decides if image should be downloaded */
    shouldAutoDownload: PropTypes.func,
    /** URL of the image in webp format */
    webp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.bool,
    ]),

    // for testing
    /** If you will not pass this value, component will detect onLine status based on browser API, otherwise will use passed value */
    onLine: PropTypes.bool,
  }

  static defaultProps = {
    /**
     * @returns {boolean} - is connection good enough to auto load the image
     */
    shouldAutoDownload: ({
      connection,
      downlink,
      rtt,
      size,
      threshold,
      possiblySlowNetwork,
    }) => {
      if (possiblySlowNetwork) return false
      if (downlink && size && threshold) {
        return size * 8 / (downlink * 1000) + rtt < threshold
      }
      switch (connection) {
        case 'slow-2g':
        case '2g':
        case '3g':
          return false
        case '4g':
        default:
          return true
      }
    },
  }

  componentDidMount() {
    if (nativeConnection) {
      this.updateConnection = () => {
        if (!navigator.onLine) return
        if (this.state.loadState === initial) {
          this.setState({
            connection: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
          })
        }
      }
      navigator.connection.addEventListener('onchange', this.updateConnection)
    } else if (this.props.threshold) {
      this.possiblySlowNetworkListener = e => {
        if (this.state.loadState !== initial) return
        const {possiblySlowNetwork} = e.detail
        if (!this.state.possiblySlowNetwork && possiblySlowNetwork) {
          this.setState({possiblySlowNetwork})
        }
      }
      window.document.addEventListener(
        'possiblySlowNetwork',
        this.possiblySlowNetworkListener,
      )
    }
    if (!this.state.controledOnLine) {
      this.updateOnlineStatus = () => this.setState({onLine: navigator.onLine})
      this.updateOnlineStatus()
      window.addEventListener('online', this.updateOnlineStatus)
      window.addEventListener('offline', this.updateOnlineStatus)
    }
  }

  componentWillUnmount() {
    this.clear()
    if (nativeConnection) {
      navigator.connection.removeEventListener(
        'onchange',
        this.updateConnection,
      )
    } else if (this.props.threshold) {
      window.document.removeEventListener(
        'possiblySlowNetwork',
        this.possiblySlowNetworkListener,
      )
    }
    if (!this.state.controledOnLine) {
      window.removeEventListener('online', this.updateOnlineStatus)
      window.removeEventListener('offline', this.updateOnlineStatus)
    }
  }

  // TODO: fix this
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.controledOnLine) {
      if (nextProps.onLine === undefined) {
        throw new Error('You should pass onLine value to controlled component')
      } else {
        this.setState({onLine: nextProps.onLine})
      }
    }
    if (nextProps.src !== this.props.src) this.cancel(false)
  }

  onClick = () => {
    const {loadState, onLine, overThreshold} = this.state
    if (!onLine) return
    switch (loadState) {
      case loading:
        if (overThreshold) this.cancel(true)
        return
      case loaded:
        // nothing
        return
      case initial:
      case error:
        this.load(true)
        return
      default:
        throw new Error(`Wrong state: ${loadState}`)
    }
  }

  clear() {
    if (this.loader) {
      this.loader.cancel()
      this.loader = undefined
    }
  }

  cancel(userTriggered) {
    if (loading !== this.state.loadState) return
    this.clear()
    this.loadStateChange(initial, userTriggered)
  }

  loadStateChange(loadState, userTriggered) {
    this.setState({
      loadState,
      overThreshold: false,
      userTriggered: !!userTriggered,
    })
  }

  load = userTriggered => {
    const {loadState} = this.state
    if (ssr || loaded === loadState || loading === loadState) return
    this.loadStateChange(loading, userTriggered)

    const {threshold, src, webp} = this.props
    let url = src
    if (webp && supportsWebp) {
      if (webp === true) {
        url = src.replace(/\.jpe?g$/i, '.webp')
      } else if (typeof webp === 'function') {
        url = webp(src)
      } else {
        url = webp
      }
    }
    this.setState({src: url})

    const imageLoader = xhrLoader(url)
    imageLoader
      .then(() => {
        this.clear()
        this.loadStateChange(loaded, false)
      })
      .catch(() => {
        this.clear()
        // if (e.status === 404) {
        //   this.setState({errorMeassage: 'Image not found'})
        // }
        this.loadStateChange(error, false)
      })

    if (threshold) {
      const timeoutLoader = timeout(threshold)
      timeoutLoader.then(() => {
        if (!this.loader) return
        window.document.dispatchEvent(
          new CustomEvent('possiblySlowNetwork', {
            detail: {possiblySlowNetwork: true},
          }),
        )
        this.setState({overThreshold: true})
        if (!this.state.userTriggered) this.cancel(true)
      })
      this.loader = cancelSecond(imageLoader, timeoutLoader)
    } else {
      this.loader = imageLoader
    }
  }

  shouldAutoDownload() {
    const {shouldAutoDownload, webp, size, webpSize} = this.props
    if (webp && supportsWebp) {
      return shouldAutoDownload({...this.state, size: webpSize})
    } else {
      return shouldAutoDownload({...this.state, size})
    }
  }

  stateToIcon(state) {
    const {loadState, onLine, overThreshold, userTriggered} = state
    const shouldAutoDownload = this.shouldAutoDownload()
    if (ssr) return icons.noicon
    switch (loadState) {
      case loaded:
        return icons.loaded
      case loading:
        return overThreshold ? icons.loading : icons.noicon
      case initial:
        if (onLine) {
          return userTriggered || !shouldAutoDownload
            ? icons.load
            : icons.noicon
        } else {
          return icons.offline
        }
      case error:
        return onLine ? icons.error : icons.offline
      default:
        throw new Error(`Wrong state: ${loadState}`)
    }
  }

  onEnter = () => {
    if (this.state.inViewport) return
    this.setState({inViewport: true})
    if (this.shouldAutoDownload()) this.load(false)
  }

  onLeave = () => {
    if (this.state.loadState === loading && !this.state.userTriggered) {
      this.setState({inViewport: false})
      this.cancel(false)
    }
  }

  render() {
    return (
      <Waypoint onEnter={this.onEnter} onLeave={this.onLeave}>
        <Media
          {...this.props}
          onClick={this.onClick}
          icon={this.stateToIcon(this.state)}
          src={this.state.src}
        />
      </Waypoint>
    )
  }
}
