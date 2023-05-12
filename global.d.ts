import {
  Component, ComponentType, ComponentClass, CSSProperties, ReactElement, Ref
} from 'react'

declare global {
  // @see https://stackoverflow.com/questions/38383676/error-ts2339-property-connection-does-not-exist-on-type-navigator
  interface Navigator extends NavigatorNetworkInformation {}
  interface WorkerNavigator extends NavigatorNetworkInformation {}
  interface NavigatorNetworkInformation {
    readonly connection: NetworkInformation
  }
  type Megabit = number
  type Millisecond = number
  type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g'
  type ConnectionType =
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'mixed'
    | 'none'
    | 'other'
    | 'unknown'
    | 'wifi'
    | 'wimax'
  interface NetworkInformation extends EventTarget {
    readonly type?: ConnectionType
    readonly effectiveType?: EffectiveConnectionType
    readonly downlinkMax?: Megabit
    readonly downlink?: Megabit
    readonly rtt?: Millisecond
    readonly saveData?: boolean
    onchange?: EventListener
  }

  type LoadingState = 'initial' | 'loading' | 'loaded' | 'error'

  type IconKey =
    | 'load'
    | 'loading'
    | 'loaded'
    | 'error'
    | 'noicon'
    | 'offline'

  interface SrcType {
    width: number
    src?: string
    size?: number
    format?: 'webp' | 'jpeg'
  }

  type ThemeKey = 'placeholder' | 'img' | 'icon' | 'noscript'

  interface ImageProps {
    /**
     * This function decides what icon to show based on the current state of the component.
     */
    getIcon?: (state: LoadingState) => IconKey
    /**
     * This function decides what message to show based on the icon (returned from getIcon prop) and
     * the current state of the component.
     */
    getMessage?: (icon: IconKey, state: LoadingState) => string
    /**
     * This function is called as soon as the component enters the viewport and is used to generate urls
     * based on width and format if props.srcSet doesn't provide src field.
     */
    getUrl?: (srcType: SrcType) => string
    /**
     * The Height of the image in px.
     */
    height: number
    /**
     * This provides a map of the icons. By default, the component uses icons from material design,
     * implemented as React components with the SVG element. You can customize icons
     */
    icons: Partial<Record<IconKey, ComponentType>>
    /**
     * This prop takes one of the 2 options, xhr and image.
     * Read more about it:
     * https://github.com/stereobooster/react-ideal-image/blob/master/introduction.md#cancel-download
     */
    loader?: 'xhr' | 'image'
    /**
     * https://github.com/stereobooster/react-ideal-image/blob/master/introduction.md#lqip
     */
    placeholder: {color: string} | {lqip: string}
    /**
     * This function decides if image should be downloaded automatically. The default function
     * returns false for a 2g network, for a 3g network it decides based on props.threshold
     * and for a 4g network it returns true by default.
     */
    shouldAutoDownload?: (
      options: {
        connection?: 'slow-2g' | '2g' | '3g' | '4g'
        size?: number
        threshold?: number
        possiblySlowNetwork?: boolean
      },
    ) => boolean
    /**
     * This provides an array of sources of different format and size of the image.
     * Read more about it:
     * https://github.com/stereobooster/react-ideal-image/blob/master/introduction.md#srcset
     */
    srcSet: SrcType[]
    /**
     * This provides a theme to the component. By default, the component uses inline styles,
     * but it is also possible to use CSS modules and override all styles.
     */
    theme?: Partial<Record<ThemeKey, string | CSSProperties>>
    /**
     * Tells how much to wait in milliseconds until consider the download to be slow.
     */
    threshold?: number
    /**
     * Width of the image in px.
     */
    width: number
  }

  interface MediaProps extends Required<ImageProps> {
    /** Color of the icon */
    iconColor?: string;
    /** Size of the icon in px */
    iconSize?: number,
    /** display icon */
    icon: IconKey
    /** Alternative text */
    alt: string;
    /** React's style attribute for root element of the component */
    style: Record<string, any>,
    /** React's className attribute for root element of the component */
    className: string,
    /** On click handler */
    onClick: (event: MouseEvent<HTMLDivElement, MouseEvent>): void;
    /** callback to get dimensions of the placeholder */
    onDimensions: Function,
    /** message to show below the icon */
    message: ReactElement,
    /** reference for Waypoint */
    innerRef?: Ref<HTMLDivElement> | undefined,
    /** noscript image src */
    nsSrc: string,
    /** noscript image srcSet */
    nsSrcSet: string,
  }
  }

  type IdealImageComponent = ComponentClass<ImageProps>

  const IdealImage: IdealImageComponent
}
