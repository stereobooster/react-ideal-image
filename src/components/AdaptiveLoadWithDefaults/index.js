import React from 'react'
import AdaptiveLoad from '../AdaptiveLoad'
import icons from '../icons'
import theme from '../theme'

const AdaptiveLoadWithDefaults = props => <AdaptiveLoad {...props} />

AdaptiveLoadWithDefaults.defaultProps = {
  ...AdaptiveLoad.defaultProps,
  icons,
  theme,
}

AdaptiveLoadWithDefaults.propTypes = AdaptiveLoad.propTypes

export default AdaptiveLoadWithDefaults
