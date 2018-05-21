import React from 'react'
import PropTypes from 'prop-types'
import Media from '../Media'
import defaultIcons from '../defaultIcons'
import {icons} from '../constants'

const {load, loading, loaded, error, noicon, offline} = icons

const MediaWithDefaultIcons = props => <Media {...props} />

MediaWithDefaultIcons.propTypes = {
  /** URL of the image */
  src: PropTypes.string.isRequired,
  /** Width of the image in px */
  width: PropTypes.number.isRequired,
  /** Height of the image in px */
  height: PropTypes.number.isRequired,
  placeholder: PropTypes.oneOfType([
    PropTypes.shape({
      /** Solid color placeholder */
      color: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      /**
       * [Low Quality Image Placeholder](https://github.com/zouhir/lqip)
       * [SVG-Based Image Placeholder](https://github.com/technopagan/sqip)
       * base64 encoded image of low quality
       */
      preview: PropTypes.string.isRequired,
    }),
  ]).isRequired,
  /** Alternative text */
  alt: PropTypes.string,
  /** Color of the icon */
  iconColor: PropTypes.string,
  /** Size of the icon in px */
  iconSize: PropTypes.number,
  /** CSS class which will hide elements if JS is disabled */
  noscript: PropTypes.string,
  /** React's style attribute for root element of the component */
  style: PropTypes.object,
  /** React's className attribute for root element of the component */
  className: PropTypes.string,
  /** On click handler */
  onClick: PropTypes.func,
  /** display icon */
  icon: PropTypes.oneOf([load, loading, loaded, error, noicon, offline]),
  /** Map of icons */
  icons: PropTypes.object,
  innerRef: PropTypes.any,
}
MediaWithDefaultIcons.defaultProps = {
  ...Media.defaultProps,
  icons: defaultIcons,
}

export default MediaWithDefaultIcons
