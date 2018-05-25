import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Media from '../Media'
import {icons, loadStates} from '../constants'
import {image, timeout, cancelSecond} from '../loaders'

const {initial, loading, loaded, error} = loadStates

const ssr =
  typeof window === 'undefined' || window.navigator.userAgent === 'ReactSnap'

export default class ManualLoad extends Component {
  static propTypes = {
    // core properties
    /** URL of the image */
    src: PropTypes.string.isRequired,
    /** how much to wait in ms until concider download to slow */
    threshold: PropTypes.number,

    // for testing
    /** If you will not pass this value, component will detect onLine status based on browser API, otherwise will use passed value */
    onLine: PropTypes.bool,

    // for LazyLoad
    /** function to convert state of the component to icon in Media */
    stateToIcon: PropTypes.func,
    /** If you will pass true it will immediately load image otherwise load will be controlled by user */
    load: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    const controledOnLine = props.onLine !== undefined
    const controledLoad = props.load !== undefined
    this.state = {
      onLine: controledOnLine ? props.onLine : true,
      controledLoad,
      controledOnLine,
      loadState: initial,
      overThreshold: false,
    }
  }

  componentDidMount() {
    if (this.props.load) this.load()
    if (!this.state.controledOnLine) {
      this.updateOnlineStatus = () => this.setState({onLine: navigator.onLine})
      this.updateOnlineStatus()
      window.addEventListener('online', this.updateOnlineStatus)
      window.addEventListener('offline', this.updateOnlineStatus)
    }
  }

  componentWillUnmount() {
    this.clear()
    if (!this.state.controledOnLine) {
      window.removeEventListener('online', this.updateOnlineStatus)
      window.removeEventListener('offline', this.updateOnlineStatus)
    }
  }

  // TODO: fix this
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.controledLoad && nextProps.load === undefined) {
      throw new Error('You should pass load value to controlled component')
    }
    if (this.state.controledOnLine) {
      if (nextProps.onLine === undefined) {
        throw new Error('You should pass onLine value to controlled component')
      } else {
        this.setState({onLine: nextProps.onLine})
      }
    }
    if (nextProps.src !== this.props.src) this.cancel()
    if (nextProps.load === true) this.load()
    if (nextProps.load === false) this.cancel()
  }

  onClick() {
    const {loadState, onLine, overThreshold} = this.state
    if (!onLine) return
    switch (loadState) {
      case loading:
        if (overThreshold) this.cancel()
        return
      case loaded:
        // nothing
        return
      case initial:
      case error:
        this.load()
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

  cancel() {
    if (loading !== this.state.loadState) return
    this.clear()
    this.loadStateChange(initial)
  }

  loadStateChange(loadState) {
    this.setState({loadState, overThreshold: false})
  }

  load() {
    const {loadState} = this.state
    if (ssr || loaded === loadState || loading === loadState) return
    this.loadStateChange(loading)

    const {threshold, src} = this.props
    const imageLoader = image(src)
    imageLoader
      .then(() => this.loadStateChange(loaded))
      .catch(() => this.loadStateChange(error))

    let timeoutLoader
    if (threshold) {
      timeoutLoader = timeout(threshold)
      timeoutLoader.then(() => this.setState({overThreshold: true}))
    }

    this.loader = cancelSecond(imageLoader, timeoutLoader)
  }

  stateToIcon({loadState, onLine, overThreshold}) {
    if (ssr) return icons.noicon
    switch (loadState) {
      case loaded:
        return icons.loaded
      case loading:
        return overThreshold ? icons.loading : icons.noicon
      case initial:
        return onLine ? icons.load : icons.offline
      case error:
        return onLine ? icons.error : icons.offline
      default:
        throw new Error(`Wrong state: ${loadState}`)
    }
  }

  render() {
    let icon
    if (this.props.stateToIcon) icon = this.props.stateToIcon(this.state)
    if (!icon) icon = this.stateToIcon(this.state)
    return <Media {...this.props} onClick={() => this.onClick()} icon={icon} />
  }
}
