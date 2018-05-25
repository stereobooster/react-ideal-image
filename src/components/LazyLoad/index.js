import React, {Component} from 'react'
import Waypoint from 'react-waypoint'
import ManualLoad from '../ManualLoad'
import {icons, loadStates} from '../constants'

export default class LazyLoad extends Component {
  constructor(props) {
    super(props)
    this.state = {inViewport: false}
    this.onEnter = () => {
      if (!this.state.inViewport) this.setState({inViewport: true})
    }
  }

  stateToIcon({loadState}) {
    switch (loadState) {
      case loadStates.initial:
        return icons.noicon
      default:
        return undefined
    }
  }

  render() {
    return (
      <Waypoint onEnter={this.onEnter}>
        <ManualLoad
          load={this.state.inViewport}
          stateToIcon={this.stateToIcon}
          {...this.props}
        />
      </Waypoint>
    )
  }
}

LazyLoad.props = ManualLoad.props
