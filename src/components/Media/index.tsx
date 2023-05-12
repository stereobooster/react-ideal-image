import React, {useEffect, useState, type FC} from 'react'
import compose from '../composeStyle'
import {icons as defaultIcons} from '../constants'

const {load, loading, loaded, error, noicon, offline} = defaultIcons

const Media: FC<MediaProps> = ({
  iconColor = '#fff',
  iconSize = 64,
  ...props,
}) => {
  const [dimensionElement, setDimensionElement] = useState<SVGSVGElement | null>(null)
  const renderIcon = (useProps) {
    const {icon, icons, iconColor: fill, iconSize: size, theme} = useProps
    const iconToRender = icons[icon]

    if (!iconToRender) return null

    const styleOrClass = compose(
      {width: size + 100, height: size, color: fill},
      theme.icon,
    )

    return React.createElement('div', styleOrClass, [
      React.createElement(iconToRender, {fill, size, key: 'icon'}),
      React.createElement('br', {key: 'br'}),
      useProps.message,
    ])
  }

  const renderImage = (useProps) => {
    return useProps.icon === loaded ? (
      <img
        {...compose(useProps.theme.img)}
        src={useProps.src}
        alt={useProps.alt}
        width={useProps.width}
        height={useProps.height}
      />
    ) : (
      <svg
        {...compose(useProps.theme.img)}
        width={useProps.width}
        height={useProps.height}
        ref={ref => (setDimensionElement(ref))}
      />
    )
  }

  const renderNoscript = (props) => {
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

  useEffect(() => {
    if (props.onDimensions && dimensionElement)
      /* Firefox returns 0 for both clientWidth and clientHeight.
      To fix this we can check the parentNode's clientWidth and clientHeight as a fallback. */
      props.onDimensions({
        width:
          dimensionElement.clientWidth ||
          dimensionElement.parentNode?.clientWidth,
        height:
          dimensionElement.clientHeight ||
          dimensionElement.parentNode?.clientHeight,
      })
  }, [])

  const useProps = {
    iconColor,
    iconSize,
    ...props
  }
  const {placeholder, theme} = useProps
  let background
  if (useProps.icon === loaded) {
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
        useProps.style,
        useProps.className,
      )}
      onClick={useProps.onClick}
      onKeyPress={useProps.onClick}
      ref={useProps.innerRef}
    >
      {renderImage(useProps)}
      {renderNoscript(useProps)}
      {renderIcon(useProps)}
    </div>
  )
}


export default Media;
