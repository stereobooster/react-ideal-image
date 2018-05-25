// There is an issue with cancelable interface
// It is not obvious that
// `image(src)` has `cancel` function
// but `image(src).then()` doesn't

import {unfetch, UnfetchAbortController} from './unfetch'

/**
 * If first promise resolved, rejected or canceled
 * second promise will be caneled
 *
 * @param {Promise} p1 - first promise with cancel
 * @param {Promise} p2 - second promise with cancel
 * @returns {Promise} - new promise with cancel
 */
export const cancelSecond = (p1, p2) => {
  if (!p2) return p1
  // const result = p1.then(
  //   x => {
  //     p2.cancel()
  //     return x
  //   },
  //   x => {
  //     p2.cancel()
  //     return x
  //   },
  // )
  const result = p1.then(x => x, x => x)
  // TODO check if p1 already canceled
  // then cancel p2 immediately
  result.cancel = () => {
    p1.cancel()
    p2.cancel()
  }
  return result
}

export const timeout = threshold => {
  let timerId
  const result = new Promise(resolve => {
    timerId = setTimeout(resolve, threshold)
  })
  result.cancel = () => {
    // there is a bug with cancel somewhere in the code
    // if (!timerId) throw new Error('Already canceled')
    clearTimeout(timerId)
    timerId = undefined
  }
  return result
}

export const image = src => {
  let img = new Image()
  const result = new Promise((resolve, reject) => {
    img.onload = resolve
    // eslint-disable-next-line no-multi-assign
    img.onabort = img.onerror = () => reject({})
    img.src = src
  })
  result.cancel = () => {
    if (!img) throw new Error('Already canceled')
    // eslint-disable-next-line no-multi-assign
    img.onload = img.onabort = img.onerror = undefined
    img.src = ''
    img = undefined
  }
  return result
}

export const xhrLoader = (url, options) => {
  let controller = new UnfetchAbortController()
  const signal = controller.signal
  const result = new Promise((resolve, reject) =>
    unfetch(url, {...options, signal}).then(response => {
      if (response.ok) {
        response
          .blob()
          // we still need image to do actual decoding
          // but if images are uncachable this will lead to two requests
          .then(() => image(url))
          .then(resolve)
      } else {
        reject({status: response.status})
      }
    }, reject),
  )
  result.cancel = () => {
    if (!controller) throw new Error('Already canceled')
    controller.abort()
    controller = undefined
  }
  return result
}

// export const fetchLoader = (url, options) => {
//   // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
//   let controller = new AbortController()
//   const signal = controller.signal
//   const result = new Promise((resolve, reject) =>
//     fetch(url, {...options, signal}).then(response => {
//       if (response.ok) {
//         options && options.onMeta && options.onMeta(response.headers)
//         response
//           .blob()
//           // we still need image to do actual decoding
//           // but if images are uncachable this will lead to two requests
//           .then(() => image(url))
//           .then(resolve)
//       } else {
//         reject({status: response.status})
//       }
//     }, reject),
//   )
//   result.cancel = () => {
//     if (!controller) throw new Error('Already canceled')
//     controller.abort()
//     controller = undefined
//   }
//   return result
// }
