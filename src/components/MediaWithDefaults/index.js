import React from 'react'
import Media from '../Media'
import icons from '../icons'
import theme from '../theme'

const MediaWithDefaults = props => <Media {...props} />

MediaWithDefaults.defaultProps = {
  ...Media.defaultProps,
  icons,
  theme,
}

// eslint-disable-next-line react/forbid-foreign-prop-types
MediaWithDefaults.propTypes = Media.propTypes

export default MediaWithDefaults
