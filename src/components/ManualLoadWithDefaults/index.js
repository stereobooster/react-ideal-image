import React from 'react'
import ManualLoad from '../ManualLoad'
import icons from '../icons'
import theme from '../theme'

const ManualLoadWithDefaults = props => <ManualLoad {...props} />

ManualLoadWithDefaults.defaultProps = {
  ...ManualLoad.defaultProps,
  icons,
  theme,
}

// eslint-disable-next-line react/forbid-foreign-prop-types
ManualLoadWithDefaults.propTypes = ManualLoad.propTypes

export default ManualLoadWithDefaults
