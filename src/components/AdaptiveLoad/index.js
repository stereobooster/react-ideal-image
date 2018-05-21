import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ManualLoad from '../ManualLoad'
import LazyLoad from '../LazyLoad'
import {loadStates} from '../constants'

const nativeConnection =
  typeof window !== undefined && !!window.navigator.connection

export default class AdaptiveLoad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadState: loadStates.initial,
      connection: nativeConnection
        ? navigator.connection.effectiveType // 'slow-2g', '2g', '3g', or '4g'
        : null,
      canceled: false,
      overThreshold: false,
    }
  }

  static propTypes = {
    threshold: PropTypes.number,
    connectionToLoad: PropTypes.func,
  }

  static defaultProps = {
    /**
     * @param {string} connection - effective connection type e.g. 'slow-2g', '2g', '3g', or '4g'
     * @returns {boolean} - is connection good enough to auto load the image
     */
    connectionToLoad: (connection, {size, threshold}) => {
      switch (connection) {
        case 'slow-2g':
        case '2g':
          return false
        case '3g':
          if (!size || !threshold) {
            return false // don't load
          } else {
            // assume slow 3g e.g. 400Kbps
            // threshold is in ms
            return size * 8 / 400 < threshold
          }
        case '4g':
          return true
        default:
          return true
      }
    },
  }

  componentDidMount() {
    if (!this.state.controledConnection) {
      if (nativeConnection) {
        this.updateConnection = () => {
          if (!navigator.onLine) return
          if (this.state.loadState === loadStates.initial) {
            this.setState({connection: navigator.connection.effectiveType})
          }
        }
        navigator.connection.addEventListener('onchange', this.updateConnection)
      } else if (this.props.threshold) {
        this.overThresholdListener = e => {
          if (this.state.loadState !== loadStates.initial) return
          const {overThreshold} = e.detail
          if (!this.state.overThreshold && overThreshold) {
            this.setState({overThreshold})
          }
        }
        window.document.addEventListener(
          'overThreshold',
          this.overThresholdListener,
        )
        // this.connectionListener = e => {
        //   if (this.state.loadState !== loadStates.initial) return;
        //   const { size, time } = e.detail;
        //   const speed = 8 * size / time; //Kbps
        //   if (speed < 400 && this.state.connection > "3g") {
        //     this.setState({ connection: "3g" });
        //   }
        // };
        // window.document.addEventListener("connection", this.connectionListener);
      }
    }
  }

  componentWillUnmount() {
    if (!this.state.controledOnLine) {
      if (nativeConnection) {
        navigator.connection.removeEventListener(
          'onchange',
          this.updateConnection,
        )
      } else if (this.props.threshold) {
        window.document.removeEventListener(
          'overThreshold',
          this.overThresholdListener,
        )
        // window.document.removeEventListener(
        //   "connection",
        //   this.connectionListener
        // );
      }
    }
  }

  stateToComponent({connection, canceled, overThreshold}) {
    const autoLoad = nativeConnection
      ? this.props.connectionToLoad(connection, this.props)
      : true
    if (canceled || overThreshold || !autoLoad) {
      return ManualLoad
    } else {
      return LazyLoad
    }
  }

  render() {
    return React.createElement(this.stateToComponent(this.state), {
      ...this.props,
      onLoadStateChange: loadState =>
        this.setState({
          loadState,
          canceled: loadState === loadStates.initial,
        }),
    })
  }
}

AdaptiveLoad.props = ManualLoad.props
