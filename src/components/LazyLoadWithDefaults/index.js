import React from 'react'
import LazyLoad from '../LazyLoad'
import icons from '../icons'
import theme from '../theme'

const LazyLoadWithDefaults = props => <LazyLoad {...props} />

LazyLoadWithDefaults.defaultProps = {
  ...LazyLoad.defaultProps,
  icons,
  theme,
}

// eslint-disable-next-line react/forbid-foreign-prop-types
LazyLoadWithDefaults.propTypes = LazyLoad.propTypes

export default LazyLoadWithDefaults
