<div align="center">
<h1>react-ideal-image</h1>

<p>Adaptive image component</p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

I need React component to asynchronously load images, which will adapt based on network, which will allow a user to control, which image to load.

## This solution

Read the [introduction](introduction.md).

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [Polyfill](#polyfill)
- [Other Solutions](#other-solutions)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install react-ideal-image react-waypoint --save
```

## Usage

Example for create-react-app (you need v2 for macros) based project

```js
import React from 'react'
import lqip from 'lqip.macro'
import IdealImage from 'react-ideal-image'

import image from './images/doggo.jpg'
const lqip = lqip('./images/doggo.jpg')

const App = () => (
  <IdealImage
    lqip={{lqip}}
    srcset={[{src: image, width: 3500}]}
    alt="doggo"
    width={3500}
    height={2095}
  />
)
```

## Polyfill

This package uses the [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API

You can import the
[polyfill](https://www.npmjs.com/package/react-intersection-observer) directly or use
a service like [polyfill.io](https://polyfill.io/v2/docs/) to add it when
needed.

```sh
yarn add intersection-observer
```

Then import it in your app:

```js
import 'intersection-observer'
```

If you are using Webpack (or similar) you could use [dynamic
imports](https://webpack.js.org/api/module-methods/#import-), to load the
Polyfill only if needed. A basic implementation could look something like this:

```js
loadPolyfills()
  .then(() => /* Render React application now that your Polyfills are ready */)

/**
* Do feature detection, to figure out which polyfills needs to be imported.
**/
function loadPolyfills() {
  const polyfills = []

  if (!supportsIntersectionObserver()) {
    polyfills.push(import('intersection-observer'))
  }

  return Promise.all(polyfills)
}

function supportsIntersectionObserver() {
  return (
    'IntersectionObserver' in global &&
    'IntersectionObserverEntry' in global &&
    'intersectionRatio' in IntersectionObserverEntry.prototype
  )
}
```

## Other Solutions

- [react-progressive-image](https://github.com/FormidableLabs/react-progressive-image)
- [react-lazyload](https://github.com/jasonslyvia/react-lazyload)
- [react-lazy-image](https://github.com/sergiodxa/react-lazy-image)
- [react-image](https://github.com/mbrevda/react-image)
- [react-lazy-load](https://github.com/loktar00/react-lazy-load)
- [react-graceful-image](https://github.com/linasmnew/react-graceful-image)
- [react-worker-image](https://github.com/nitish24p/react-worker-image)
- [lazy-image](https://github.com/notwaldorf/lazy-image)

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/179534?s=460&v=4" width="100px;"/><br /><sub><b>stereobooster</b></sub>](https://github.com/stereobooster)<br />[💻](https://github.com/stereobooster/react-ideal-image/commits?author=stereobooster "Code") [📖](https://github.com/stereobooster/react-ideal-image/commits?author=stereobooster "Documentation") [🚇](#infra-stereobooster "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/stereobooster/react-ideal-image/commits?author=stereobooster "Tests") | [<img src="https://avatars3.githubusercontent.com/u/6104345?v=4" width="100px;"/><br /><sub><b>George Kormaris</b></sub>](http://www.gekorm.com)<br />[💻](https://github.com/stereobooster/react-ideal-image/commits?author=GeKorm "Code") [📖](https://github.com/stereobooster/react-ideal-image/commits?author=GeKorm "Documentation") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

Code - MIT

Icons - [Apache License 2.0](https://github.com/google/material-design-icons/blob/master/LICENSE)

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/stereobooster/react-ideal-image.svg?style=flat-square
[build]: https://travis-ci.org/stereobooster/react-ideal-image
[coverage-badge]: https://img.shields.io/codecov/c/github/stereobooster/react-ideal-image.svg?style=flat-square
[coverage]: https://codecov.io/github/stereobooster/react-ideal-image
[version-badge]: https://img.shields.io/npm/v/react-ideal-image.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-ideal-image
[downloads-badge]: https://img.shields.io/npm/dm/react-ideal-image.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/react-ideal-image
[license-badge]: https://img.shields.io/npm/l/react-ideal-image.svg?style=flat-square
[license]: https://github.com/stereobooster/react-ideal-image/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/stereobooster/react-ideal-image/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/stereobooster/react-ideal-image.svg?style=social
[github-watch]: https://github.com/stereobooster/react-ideal-image/watchers
[github-star-badge]: https://img.shields.io/github/stars/stereobooster/react-ideal-image.svg?style=social
[github-star]: https://github.com/stereobooster/react-ideal-image/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20react-ideal-image%20by%20%40stereobooster%20https%3A%2F%2Fgithub.com%2Fstereobooster%2Freact-ideal-image%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/stereobooster/react-ideal-image.svg?style=social
[emojis]: https://github.com/stereobooster/all-contributors#emoji-key
[all-contributors]: https://github.com/stereobooster/all-contributors
