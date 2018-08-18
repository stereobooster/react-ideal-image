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

[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors)
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
- [Props](#props)
  - [getIcon](#geticon)
  - [getMessage](#getmessage)
  - [getUrl](#geturl)
  - [height](#height)
  - [icons](#icons)
  - [loader](#loader)
  - [placeholder](#placeholder)
  - [shouldAutoDownload](#shouldautodownload)
  - [srcSet](#srcset)
  - [theme](#theme)
  - [threshold](#threshold)
  - [width](#width)
- [Other Solutions](#other-solutions)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install react-ideal-image --save
```

> This package also depends on `react`, `prop-types`, and `react-waypoint`.
> Please make sure you have those installed as well.

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
    placeholder={{lqip}}
    srcSet={[{src: image, width: 3500}]}
    alt="doggo"
    width={3500}
    height={2095}
  />
)
```

## Props

This is the list of props that you need to pass to the component.

### getIcon

> `function(state: object)` | optional, default icon is provided based on state object

This function decides what icon to show based on the current state of the component.

### getMessage

> `function(icon: string, state: object)` | optional, default message is provided based on the icon and state object.

This function decides what message to show based on the icon (returned from getIcon prop) and the current state of the component.

### getUrl

> `function({})` | optional, no useful default

This function is called as soon as the component enters the viewport and is used to generate urls based on width and format if `props.srcSet` doesn't provide src field.

### height

> `number` | required

The Height of the image in px.

### icons

> `object` | required

This provides a map of the icons. By default, the component uses icons from material design, implemented as React components with the SVG element. You can customize icons

```js
const icons = {
  load: DownloadIcon,
  //...
}
```

### loader

> `string` | optional, defaults to 'xhr'

This prop takes one of the 2 options, `xhr` and `image`. Read more about it [here](https://github.com/stereobooster/react-ideal-image/blob/master/introduction.md#cancel-download).

### placeholder

> `object` | required

This takes one of the 2 objects

```js
// To add a solid color placeholder
{
  color: ''
}
```

or

```js
/**
 * To add a low quality image
 * [Low Quality Image Placeholder](https://github.com/zouhir/lqip)
 * [SVG-Based Image Placeholder](https://github.com/technopagan/sqip)
 * base64 encoded image of low quality
 */
{
  lqip: ''
}
```

Read more about it [here](https://github.com/stereobooster/react-ideal-image/blob/master/introduction.md#lqip).

### shouldAutoDownload

> `function({})` | optional, default function is provided which decides based on the device network.

This function decides if image should be downloaded automatically. The default function returns `false` for a `2g` network,
for a `3g` network it decides based on `props.threshold` and for a `4g` network it returns `true` by default.

### srcSet

> `array[srcType: object]` | required

This provides an array of sources of different format and size of the image. Read more about it [here](https://github.com/stereobooster/react-ideal-image/blob/master/introduction.md#srcset).
The `srcType` has below structure

```js
srcType = {
  width: number, // required
  src: string,
  size: number,
  format: string, // one of the 'jpeg' or 'webp'
}
```

### theme

> `object` | required

This provides a theme to the component. By default, the component uses inline styles, but it is also possible to use CSS modules and override all styles.

```js
const theme = {
  placeholder: {
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
  },
  // ...
}
```

### threshold

> `number` | optional

Tells how much to wait in milliseconds until consider the download to be slow.

### width

> `number` | required

Width of the image in px.

## Other Solutions

- [react-progressive-image](https://github.com/FormidableLabs/react-progressive-image)
- [react-lazyload](https://github.com/jasonslyvia/react-lazyload)
- [react-lazy-image](https://github.com/sergiodxa/react-lazy-image)
- [react-image](https://github.com/mbrevda/react-image)
- [react-lazy-load](https://github.com/loktar00/react-lazy-load)
- [react-graceful-image](https://github.com/linasmnew/react-graceful-image)
- [react-worker-image](https://github.com/nitish24p/react-worker-image)
- [lazy-image](https://github.com/notwaldorf/lazy-image)
- [react-simple-image](https://github.com/bitjourney/react-simple-image)
- [react-power-picture](https://github.com/tvthatsme/react-power-picture)
- [react-shimmer](https://github.com/gokcan/react-shimmer)
- [gatsby-image](https://www.gatsbyjs.org/packages/gatsby-image/)
- [react-async-elements `<Img>`](https://github.com/palmerhq/react-async-elements#img)

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/179534?s=460&v=4" width="100px;"/><br /><sub><b>stereobooster</b></sub>](https://github.com/stereobooster)<br />[💻](https://github.com/stereobooster/react-ideal-image/commits?author=stereobooster "Code") [📖](https://github.com/stereobooster/react-ideal-image/commits?author=stereobooster "Documentation") [🚇](#infra-stereobooster "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/stereobooster/react-ideal-image/commits?author=stereobooster "Tests") | [<img src="https://avatars1.githubusercontent.com/u/498274?s=460&v=4" width="100px;"/><br /><sub><b>Ivan Babak</b></sub>](https://github.com/sompylasar)<br />[📖](https://github.com/stereobooster/react-ideal-image/commits?author=sompylasar "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/4299398?s=460&v=4" width="100px;"/><br /><sub><b>Arun Kumar</b></sub>](https://github.com/palerdot)<br />[📖](https://github.com/stereobooster/react-ideal-image/commits?author=palerdot "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/1192452?v=4" width="100px;"/><br /><sub><b>Andrew Lisowski</b></sub>](http://hipstersmoothie.com)<br />[💻](https://github.com/stereobooster/react-ideal-image/commits?author=hipstersmoothie "Code") | [<img src="https://avatars1.githubusercontent.com/u/3386714?v=4" width="100px;"/><br /><sub><b>Timothy Vernon</b></sub>](https://github.com/tvthatsme)<br />[⚠️](https://github.com/stereobooster/react-ideal-image/commits?author=tvthatsme "Tests") | [<img src="https://avatars0.githubusercontent.com/u/5151881?v=4" width="100px;"/><br /><sub><b>vishalShinde</b></sub>](http://vs1682.github.io)<br />[📖](https://github.com/stereobooster/react-ideal-image/commits?author=vs1682 "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/5207796?v=4" width="100px;"/><br /><sub><b>Evgeniy Kumachev</b></sub>](https://github.com/EvgeniyKumachev)<br />[📖](https://github.com/stereobooster/react-ideal-image/commits?author=EvgeniyKumachev "Documentation") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars0.githubusercontent.com/u/2087056?v=4" width="100px;"/><br /><sub><b>John Munn</b></sub>](https://github.com/Tawe)<br />[💻](https://github.com/stereobooster/react-ideal-image/commits?author=Tawe "Code") |

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
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
