import { expect, describe, test } from "bun:test";
import renderer from "react-test-renderer";

import Download from "Icon/Download";
import Loading from "Icon/Loading";
import Offline from "Icon/Offline";
import Warning from "Icon/Warning";

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
