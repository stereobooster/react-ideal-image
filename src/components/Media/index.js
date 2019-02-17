import React, {useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import compose from '../composeStyle'
import {icons as defaultIcons} from '../constants'

const {load, loading, loaded, error, noicon, offline} = defaultIcons

const renderIcon = props => {
  const {icon, icons, iconColor: fill, iconSize: size, theme} = props
  const iconToRender = icons[icon]
  if (!iconToRender) return null
  const styleOrClass = compose(
    {width: size + 100, height: size, color: fill},
    theme.icon,
  )
  return React.createElement('div', styleOrClass, [
    React.createElement(iconToRender, {fill, size, key: 'icon'}),
    React.createElement('br', {key: 'br'}),
    props.message,
  ])
}

const renderImage = (props, dimensionElement) => {
  return props.icon === loaded ? (
    <img
      {...compose(props.theme.img)}
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
    />
  ) : (
    <svg
      {...compose(props.theme.img)}
      width={props.width}
      height={props.height}
      ref={dimensionElement}
    />
  )
}

const renderNoscript = props => {
  return props.ssr ? (
    <noscript>
      <img
        {...compose(
          props.theme.img,
          props.theme.noscript,
        )}
        src={props.nsSrc}
        srcSet={props.nsSrcSet}
        alt={props.alt}
        width={props.width}
        height={props.height}
      />
    </noscript>
  ) : null
}

const Media = props => {
  const dimensionElement = useRef(null)

  useEffect(() => {
    if (props.onDimensions && dimensionElement.current)
      /* Firefox returns 0 for both clientWidth and clientHeight.
      To fix this we can check the parentNode's clientWidth and clientHeight as a fallback. */
      props.onDimensions({
        width:
          dimensionElement.current.clientWidth ||
          dimensionElement.current.parentNode.clientWidth,
        height:
          dimensionElement.current.clientHeight ||
          dimensionElement.current.parentNode.clientHeight,
      })
  }, [])

  const {placeholder, theme} = props
  let background
  if (props.icon === loaded) {
    background = {}
  } else if (placeholder.lqip) {
    background = {
      backgroundImage: `url("${placeholder.lqip}")`,
    }
  } else {
    background = {
      backgroundColor: placeholder.color,
    }
  }
  return (
    <div
      {...compose(
        theme.placeholder,
        background,
        props.style,
        props.className,
      )}
      onClick={props.onClick}
      onKeyPress={props.onClick}
      ref={props.innerRef}
    >
      {renderImage(props, dimensionElement)}
      {renderNoscript(props)}
      {renderIcon(props)}
    </div>
  )
}

Media.propTypes = {
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
      lqip: PropTypes.string.isRequired,
    }),
  ]).isRequired,
  /** display icon */
  icon: PropTypes.oneOf([load, loading, loaded, error, noicon, offline])
    .isRequired,
  /** Map of icons */
  icons: PropTypes.object.isRequired,
  /** theme object - CSS Modules or React styles */
  theme: PropTypes.object.isRequired,
  /** Alternative text */
  alt: PropTypes.string,
  /** Color of the icon */
  iconColor: PropTypes.string,
  /** Size of the icon in px */
  iconSize: PropTypes.number,
  /** React's style attribute for root element of the component */
  style: PropTypes.object,
  /** React's className attribute for root element of the component */
  className: PropTypes.string,
  /** On click handler */
  onClick: PropTypes.func,
  /** callback to get dimensions of the placeholder */
  onDimensions: PropTypes.func,
  /** message to show below the icon */
  message: PropTypes.node,
  /** reference for Waypoint */
  innerRef: PropTypes.func,
  /** noscript image src */
  nsSrc: PropTypes.string,
  /** noscript image srcSet */
  nsSrcSet: PropTypes.string,
}

Media.defaultProps = {
  iconColor: '#fff',
  iconSize: 64,
}

export default Media
