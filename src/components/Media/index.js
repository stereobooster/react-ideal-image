import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import compose from '../composeStyle'
import {icons as defaultIcons} from '../constants'

const {load, loading, loaded, error, noicon, offline} = defaultIcons

export default class Media extends PureComponent {
  static propTypes = {
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
    theme: PropTypes.object,
  }

  static defaultProps = {
    iconColor: '#fff',
    iconSize: 64,
  }

  renderIcon(props) {
    const {icon, icons, iconColor: fill, iconSize: size, theme} = props
    const iconToRender = icons[icon]
    if (!iconToRender) return null
    const styleOrClass = compose(
      {width: size, height: size},
      theme.icon,
      props.noscript,
    )
    return React.createElement(
      'div',
      styleOrClass,
      React.createElement(iconToRender, {fill, size}),
    )
  }

  renderImage(props) {
    return props.icon === loaded ? (
      <img
        {...compose(props.theme.img, props.noscript)}
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
      />
    ) : (
      <svg
        {...compose(props.theme.img, props.noscript)}
        width={props.width}
        height={props.height}
      />
    )
  }

  renderNoscript() {
    return null
    // img inside noscript will trigger download
    // even if JS is disabled
    // TODO: use icon instead with link to the original image
    // return props.noscript ? (
    //   <noscript>
    //     <img
    //       {...compose(props.theme.img)}
    //       src={props.src}
    //       alt={props.alt}
    //       width={props.width}
    //       height={props.height}
    //     />
    //   </noscript>
    // ) : null
  }

  render() {
    const props = this.props
    const {placeholder, theme} = props
    let background
    if (placeholder.lqip) {
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
        {...compose(theme.adaptive, background, props.style, props.className)}
        title={props.alt}
        onClick={this.props.onClick}
        onKeyPress={this.props.onClick}
        ref={this.props.innerRef}
      >
        {this.renderImage(props)}
        {this.renderNoscript(props)}
        {this.renderIcon(props)}
      </div>
    )
  }
}
