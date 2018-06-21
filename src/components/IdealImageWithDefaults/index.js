import React from 'react'
import Waypoint from 'react-waypoint'
import IdealImage from '../IdealImage'
import icons from '../icons'
import theme from '../theme'

const IdealImageWithDefaults = props => <IdealImage {...props} />

IdealImageWithDefaults.defaultProps = {
  ...IdealImage.defaultProps,
  icons,
  theme,
  observer: Waypoint,
}

// eslint-disable-next-line react/forbid-foreign-prop-types
IdealImageWithDefaults.propTypes = IdealImage.propTypes

export default IdealImageWithDefaults
