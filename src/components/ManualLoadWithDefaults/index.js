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

ManualLoadWithDefaults.propTypes = ManualLoad.propTypes

export default ManualLoadWithDefaults
