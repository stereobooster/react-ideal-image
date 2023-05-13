import { useEffect, useState, useRef, type FC } from 'react'

import compose from '../composeStyle'
import defaultIcons, { ICONS }  from '../icons'
import defaultTheme from '../theme'

const Media: FC<MediaProps> = ({
  iconColor = '#fff',
  iconSize = 64,
  icons = defaultIcons,
  theme = defaultTheme,
  ...props
}) => {
  const dimensionElement = useRef<SVGSVGElement>(null)

  const Icon = ({ ...useProps }) => {
    const { icon, iconColor: fill, iconSize: size, theme } = useProps
    const Icon = (useProps.icons || icons)[icon]

    if (!Icon) return null

    const styleOrClass = compose(
      { width: size + 100, height: size, color: fill },
      theme.icon,
    )

    return (
      <div {...styleOrClass}>
        <Icon fill={fill} size={size} key={'icon'} />
        <br key='br' />
        <span key="message">{useProps.message}</span>
      </div>
    )
  }

  const Image = ({...useProps}) => {
    if (useProps.icon === ICONS.loaded) {
      const imageProps = compose(useProps.theme.img)
      return (
        <img
          {...imageProps}
          src={useProps.src}
          alt={useProps.alt}
          width={useProps.width}
          height={useProps.height}
        />
      )
    } else {
      const withoutImageProps = compose(useProps.theme.img ?? {});
      return (
        <svg
          {...withoutImageProps}
          width={useProps.width}
          height={useProps.height}
          ref={dimensionElement}
        />
      )
    }
  }

  const Noscript = ({...useProps}) => {
    return useProps.ssr ? (
      <noscript>
        <img
          {...compose(useProps.theme.img, useProps.theme.noscript)}
          src={useProps.src}
          srcSet={useProps.srcSet}
          alt={useProps.alt}
          width={useProps.width}
          height={useProps.height}
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
    icons,
    theme,
    ...props
  }

  let background
  if (useProps.icon === ICONS.loaded) {
    background = {}
  } else if (useProps.placeholder.lqip) {
    background = {
      backgroundImage: `url("${useProps.placeholder.lqip}")`,
    }
  } else {
    background = {
      backgroundColor: useProps.placeholder.color,
    }
  }

  const composedProps = compose(
      useProps.theme.placeholder,
      background,
      useProps.style,
      useProps.className,
    )

  return (
    <div
      {...composedProps}
      onClick={useProps.onClick}
      onKeyDown={useProps.onClick}
      ref={useProps.innerRef}
    >
      <Image {...useProps} key="image" />
      <Noscript {...useProps} key="noscript" />
      <Icon {...useProps} key="icon" />
    </div>
  )
}


export default Media;
