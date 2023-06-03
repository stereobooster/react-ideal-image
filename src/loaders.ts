// There is an issue with cancelable interface
// It is not obvious that
// `image(src)` has `cancel` function
// but `image(src).then()` doesn't

import {
  unfetch,
  UnfetchAbortController,
  type UnfetchOptionsInterface,
} from "./unfetch";
import { iconKeys } from "Icons";

// map iconKeys to load states, currently not adding any different ones
export const loadStates = {
  ...iconKeys,
};
export type LoadStates = keyof typeof loadStates;

export interface Cancelable extends Promise<any> {
  cancel: () => Cancelable;
}

export const combineCancel = <T extends Cancelable>(p1: T, p2?: T): T => {
  if (!p2) return p1;
  const p3: Awaited<Cancelable> = p1.then(
    (x) => x,
    (x) => x
  );
  p3.cancel = () => {
    p1.cancel();
    p2.cancel();
  };
  return p3;
};

export const timeout = (threshold): Cancelable => {
  let timerId;
  const result: Awaited<Cancelable> = new Promise((resolve) => {
    timerId = setTimeout(resolve, threshold);
  });
  result.cancel = () => {
    clearTimeout(timerId);
    timerId = undefined;
  };
  return result;
};

// Caveat: image loader can not cancel download in some browsers
export const imageLoader = (src: string): Cancelable => {
  let img = new Image();
  const result: Awaited<Cancelable> = new Promise((resolve, reject) => {
    img.onload = resolve;
    // eslint-disable-next-line no-multi-assign
    img.onabort = img.onerror = () => reject({});
    img.src = src;
  });
  result.cancel = () => {
    if (!img) {
      throw new Error("Already canceled");
    }
    // eslint-disable-next-line no-multi-assign
    img.onload = img.onabort = img.onerror = undefined;
    img.src = "";
    img = undefined;
  };
  return result;
};

// Caveat: XHR loader can cause errors because of 'Access-Control-Allow-Origin'
// Caveat: we still need imageLoader to do actual decoding,
// but if images are uncachable this will lead to two requests
export const xhrLoader = (
  url: string,
  options: UnfetchOptionsInterface = {}
): Cancelable => {
  let controller = new UnfetchAbortController();
  const signal = controller.signal;
  const result: Awaited<Cancelable> = new Promise((resolve, reject) =>
    unfetch(url, { ...options, signal }).then((response) => {
      if (response.ok) {
        response
          .blob()
          .then(() => imageLoader(url))
          .then(resolve);
      } else {
        reject({ status: response.status });
      }
    }, reject)
  );
  result.cancel = () => {
    if (!controller) {
      throw new Error("Already canceled");
    }
    controller.abort();
    controller = undefined;
  };
  return result;
};

export type LoaderTypes = "xhr" | "image";
export const idealLoader = (type: LoaderTypes) => {
  switch (type) {
    case "xhr":
      return xhrLoader;
    default:
      return imageLoader;
  }
};
