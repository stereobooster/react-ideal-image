import * as React from "react";
import { IdealImage } from "IdealImage";
import cosmosImg from "./img/cosmos.png";

export default (
  <IdealImage placeholder={"black"} srcSet={[{ src: cosmosImg }]} width={200} />
);
