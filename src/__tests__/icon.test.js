import { expect, describe, test } from "bun:test";
import React from "react";
import renderer from "react-test-renderer";

import Download from "components/Icon/Download";
import Loading from "components/Icon/Loading";
import Offline from "components/Icon/Offline";
import Warning from "components/Icon/Warning";

const snapshotTestDescription = "Should render a snapshot that is good";

describe("Download icon", () => {
  test(snapshotTestDescription, () => {
    const download = renderer.create(<Download />).toJSON();
    expect(download).toMatchSnapshot();
  });
});

describe("Loading icon", () => {
  test(snapshotTestDescription, () => {
    const loading = renderer.create(<Loading />).toJSON();
    expect(loading).toMatchSnapshot();
  });
});

describe("Offline icon", () => {
  test(snapshotTestDescription, () => {
    const offline = renderer.create(<Offline />).toJSON();
    expect(offline).toMatchSnapshot();
  });
});

describe("Warning icon", () => {
  test(snapshotTestDescription, () => {
    const warning = renderer.create(<Warning />).toJSON();
    expect(warning).toMatchSnapshot();
  });
});
