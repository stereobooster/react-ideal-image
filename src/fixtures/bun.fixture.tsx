import * as React from "react";
import { IdealImage } from "IdealImage";
import bunImg from "./img/bun.svg";

export default (
  <IdealImage placeholder={"black"} srcSet={[{ src: bunImg }]} width={200} />
);
