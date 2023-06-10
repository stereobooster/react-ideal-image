# react-idealer-image

- shoutouts to the [original authors and contributors](https://github.com/stereobooster/react-ideal-image)
- please see the original repository for extended readme and documentation
- the goal of this fork should be to merge into the original repo

## TLDR

- uses the bun runtime and is a complete refactor
- typescript first, esm only, no support for legacy browsers
- framer-motion replaces react-waypoint

```sh
bun add \
  github:noahehall/react-idealer-image \
  framer-motion \
  react \
  react-dom
```

```ts
import { IdealImage } from "react-idealer-image";

const App = () => (
  /** check the component source for the full api */
  <IdealImage
    /* see framer-motion docs */
    /* motionProps={} */
    alt="ideal image"
    // you could include specific width & height set to numbers
    srcSet={[{ src: "some/image.webp" }]}
    // prefer passing width && height set to numbers
    width={"100%"}
  />
);
```

## Contributing

```sh

# clone repo
bun install
bun run cosmos
# open localhost:5000
```
