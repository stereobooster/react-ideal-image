import {icons, loadStates} from 'components/constants'
import {bytesToSize, ssr} from 'components/helpers'

const {initial, loading, loaded, error} = loadStates

export const defaultShouldAutoDownload = ({
  connection,
  size,
  threshold,
  possiblySlowNetwork,
}) => {
  if (possiblySlowNetwork) return false
  if (!connection) return true
  const {downlink, rtt, effectiveType} = connection
  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return false
    case '3g':
      if (downlink && size && threshold) {
        return (size * 8) / (downlink * 1000) + rtt < threshold
      }
      return false
    case '4g':
    default:
      return true
  }
}

export const defaultGetMessage = (icon, imgState) => {
  switch (icon) {
    case icons.noicon:
    case icons.loaded:
      return null
    case icons.loading:
      return 'Loading...'
    case icons.load:
      // we can show `alt` here
      if (imgState.size) {
        return (
          <span>
            Click to load (
            <span style={{whiteSpace: 'nowrap'}}>
              {bytesToSize(imgState.size)}
            </span>
            , ),
          </span>
        )
      } else {
        return 'Click to load'
      }
    case icons.offline:
      return 'Your browser is offline. Image not loaded'
    case icons.error:
      if (imgState.loadInfo === 404) {
        return '404. Image not found'
      } else {
        return 'Error. Click to reload'
      }
    default:
      throw new Error(`Wrong icon: ${icon}`)
  }
}

export const defaultGetIcon = ({imgState, networkState}) => {
  if (ssr) return icons.noicon
  switch (imgState.state) {
    case loaded:
      return icons.loaded
    case loading:
      return networkState.overThreshold ? icons.loading : icons.noicon
    case initial:
      if (networkState.onLine) {
        if (imgState.shouldAutoDownload === undefined) return icons.noicon
        return imgState.userTriggered || !imgState.shouldAutoDownload
          ? icons.load
          : icons.noicon
      } else {
        return icons.offline
      }
    case error:
      return networkState.onLine ? icons.error : icons.offline
    default:
      throw new Error(`Wrong state: ${imgState.state}`)
  }
}
