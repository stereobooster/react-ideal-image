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

MediaWithDefaults.propTypes = Media.propTypes

export default MediaWithDefaults
