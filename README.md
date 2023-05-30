# react-idealer-image

- shoutouts to the [original authors and contributors](https://github.com/stereobooster/react-ideal-image)
- please see the original repository for extended readme and documentation

## TLDR

- uses the bun runtime and is a complete refactor
- no support for legacy browsers
- framer-motion is now a peer-dependency

```sh
bun add github:noahehall/react-idealer-image
```

```ts
import { IdealImage } from "react-idealer-image";

const App = () => (
  <IdealImage
    alt="ideal image"
    srcSet={[{ src: "some/image.webp", width: 3500 }]}
    width={3500}
  />
);
```
