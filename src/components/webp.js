// async function supportsWebp() {
//   if (typeof createImageBitmap === 'undefined' || typeof fetch === 'undefined')
//     return false
//   return fetch(
//     'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=',
//   )
//     .then(response => response.blob())
//     .then(blob => createImageBitmap(blob).then(() => true, () => false))
// }

// let webp = undefined
// const webpPromise = supportsWebp()
// webpPromise.then(x => (webp = x))

// export default () => {
//   if (webp === undefined) return webpPromise
//   return {
//     then: callback => callback(webp),
//   }
// }

function supportsWebp() {
  const elem = document.createElement('canvas')
  if (elem.getContext && elem.getContext('2d')) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
  } else {
    // very old browser like IE 8, canvas not supported
    return false
  }
}

export default supportsWebp()
