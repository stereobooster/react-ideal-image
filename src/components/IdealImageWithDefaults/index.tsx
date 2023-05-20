import React, { type FC } from "react";
import IdealImage from "../IdealImage";
import icons from "../icons";
import theme from "../theme";

const IdealImageWithDefaults: FC<ImageProps> = (props) => (
  <IdealImage {...props} />
);

export default IdealImageWithDefaults;
