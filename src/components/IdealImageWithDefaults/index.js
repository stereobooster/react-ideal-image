import React from 'react'
import IdealImage from '../IdealImage'
import icons from '../icons'
import theme from '../theme'

const IdealImageWithDefaults = props => <IdealImage {...props} />

IdealImageWithDefaults.defaultProps = {
  ...IdealImage.defaultProps,
  icons,
  theme,
}

// eslint-disable-next-line react/forbid-foreign-prop-types
IdealImageWithDefaults.propTypes = IdealImage.propTypes

export default IdealImageWithDefaults
